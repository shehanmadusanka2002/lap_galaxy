package com.example.productmanagement.service;

import com.example.productmanagement.dto.AddToCartRequest;
import com.example.productmanagement.dto.CartDTO;
import com.example.productmanagement.dto.CartItemDTO;
import com.example.productmanagement.exception.ResourceNotFoundException;
import com.example.productmanagement.model.Cart;
import com.example.productmanagement.model.CartItem;
import com.example.productmanagement.model.Product;
import com.example.productmanagement.model.User;
import com.example.productmanagement.repository.CartItemRepository;
import com.example.productmanagement.repository.CartRepository;
import com.example.productmanagement.repository.ProductRepository;
import com.example.productmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    @Value("${app.base-url}")
    private String baseUrl;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get or create cart for authenticated user
     */
    public Cart getOrCreateCartForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    /**
     * Get or create cart for guest user (by session ID)
     */
    public Cart getOrCreateCartForGuest(String sessionId) {
        return cartRepository.findBySessionId(sessionId)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setSessionId(sessionId);
                    return cartRepository.save(newCart);
                });
    }

    /**
     * Add item to cart
     */
    public CartDTO addToCart(AddToCartRequest request, Long userId) {
        Cart cart;
        
        // Get or create cart based on user authentication
        if (userId != null) {
            cart = getOrCreateCartForUser(userId);
        } else if (request.getSessionId() != null) {
            cart = getOrCreateCartForGuest(request.getSessionId());
        } else {
            throw new IllegalArgumentException("Either userId or sessionId must be provided");
        }

        // Get product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Check stock availability
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        // Check if product already exists in cart
        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Cannot add more items. Maximum available: " + product.getStockQuantity());
            }
            existingItem.setQuantity(newQuantity);
            existingItem.calculateSubtotal();
            cartItemRepository.save(existingItem);
        } else {
            // Create new cart item
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setUnitPrice(product.getPrice());
            cartItem.calculateSubtotal();
            cart.addItem(cartItem);
            cartItemRepository.save(cartItem);
        }

        // Recalculate totals
        cart.calculateTotals();
        cartRepository.save(cart);

        return convertToDTO(cart);
    }

    /**
     * Update cart item quantity
     */
    public CartDTO updateCartItemQuantity(Long cartId, Long itemId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!cartItem.getCart().getId().equals(cartId)) {
            throw new IllegalArgumentException("Cart item does not belong to this cart");
        }

        // Check stock availability
        if (quantity > cartItem.getProduct().getStockQuantity()) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + cartItem.getProduct().getStockQuantity());
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.removeItem(cartItem);
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItem.calculateSubtotal();
            cartItemRepository.save(cartItem);
        }

        cart.calculateTotals();
        cartRepository.save(cart);

        return convertToDTO(cart);
    }

    /**
     * Remove item from cart
     */
    public CartDTO removeFromCart(Long cartId, Long itemId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));

        if (!cartItem.getCart().getId().equals(cartId)) {
            throw new IllegalArgumentException("Cart item does not belong to this cart");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        cart.calculateTotals();
        cartRepository.save(cart);

        return convertToDTO(cart);
    }

    /**
     * Get cart by user ID
     */
    public CartDTO getCartByUserId(Long userId) {
        Cart cart = getOrCreateCartForUser(userId);
        return convertToDTO(cart);
    }

    /**
     * Get cart by session ID
     */
    public CartDTO getCartBySessionId(String sessionId) {
        Cart cart = getOrCreateCartForGuest(sessionId);
        return convertToDTO(cart);
    }

    /**
     * Clear cart
     */
    public void clearCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

        cart.clearItems();
        cartItemRepository.deleteByCartId(cartId);
        cartRepository.save(cart);
    }

    /**
     * Merge guest cart with user cart after login
     */
    public CartDTO mergeGuestCartWithUserCart(String sessionId, Long userId) {
        Cart userCart = getOrCreateCartForUser(userId);
        Cart guestCart = cartRepository.findBySessionId(sessionId).orElse(null);

        if (guestCart != null && !guestCart.getItems().isEmpty()) {
            for (CartItem guestItem : guestCart.getItems()) {
                // Check if product already exists in user cart
                CartItem existingItem = cartItemRepository
                        .findByCartIdAndProductId(userCart.getId(), guestItem.getProduct().getId())
                        .orElse(null);

                if (existingItem != null) {
                    // Merge quantities
                    int newQuantity = existingItem.getQuantity() + guestItem.getQuantity();
                    if (newQuantity > guestItem.getProduct().getStockQuantity()) {
                        newQuantity = guestItem.getProduct().getStockQuantity();
                    }
                    existingItem.setQuantity(newQuantity);
                    existingItem.calculateSubtotal();
                    cartItemRepository.save(existingItem);
                } else {
                    // Add guest item to user cart
                    CartItem newItem = new CartItem();
                    newItem.setCart(userCart);
                    newItem.setProduct(guestItem.getProduct());
                    newItem.setQuantity(guestItem.getQuantity());
                    newItem.setUnitPrice(guestItem.getUnitPrice());
                    newItem.calculateSubtotal();
                    userCart.addItem(newItem);
                    cartItemRepository.save(newItem);
                }
            }

            // Delete guest cart
            cartRepository.delete(guestCart);
        }

        userCart.calculateTotals();
        cartRepository.save(userCart);

        return convertToDTO(userCart);
    }

    /**
     * Convert Cart entity to CartDTO
     */
    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser() != null ? cart.getUser().getId() : null);
        dto.setSessionId(cart.getSessionId());
        dto.setTotalAmount(cart.getTotalAmount());
        dto.setTotalItems(cart.getTotalItems());

        // Convert cart items
        dto.setItems(cart.getItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList()));

        // Calculate shipping cost (example: free shipping over Rs. 50,000)
        BigDecimal shippingCost = cart.getTotalAmount().compareTo(new BigDecimal("50000")) >= 0
                ? BigDecimal.ZERO
                : new BigDecimal("500");
        dto.setShippingCost(shippingCost);

        // Calculate grand total
        dto.setGrandTotal(cart.getTotalAmount().add(shippingCost));

        return dto;
    }

    /**
     * Convert CartItem entity to CartItemDTO
     */
    private CartItemDTO convertItemToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setCartId(item.getCart().getId());
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductBrand(item.getProduct().getBrand());
        
        // Set image URL
        if (item.getProduct().getImagePath() != null) {
            dto.setProductImageUrl(baseUrl + "/" + item.getProduct().getImagePath());
        }
        
        dto.setUnitPrice(item.getUnitPrice());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getSubtotal());
        dto.setStockQuantity(item.getProduct().getStockQuantity());
        
        // Calculate in stock based on stockQuantity
        dto.setInStock(item.getProduct().getStockQuantity() > 0);

        return dto;
    }
}
