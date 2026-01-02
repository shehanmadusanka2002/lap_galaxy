package com.example.productmanagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.productmanagement.dto.CreateOrderRequest;
import com.example.productmanagement.dto.OrderDTO;
import com.example.productmanagement.dto.OrderItemDTO;
import com.example.productmanagement.model.Cart;
import com.example.productmanagement.model.Order;
import com.example.productmanagement.model.OrderItem;
import com.example.productmanagement.model.Product;
import com.example.productmanagement.model.User;
import com.example.productmanagement.repository.CartRepository;
import com.example.productmanagement.repository.OrderRepository;
import com.example.productmanagement.repository.ProductRepository;
import com.example.productmanagement.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final HttpServletRequest request;

    @Transactional
    public OrderDTO createOrder(CreateOrderRequest orderRequest) {
        Order order = new Order();
        
        // Set user or session
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            order.setUser(user);
        } else {
            String sessionId = request.getSession().getId();
            order.setSessionId(sessionId);
        }

        // Set order details
        order.setSubtotal(orderRequest.getSubtotal());
        order.setShippingCost(orderRequest.getShippingCost());
        order.setTotalAmount(orderRequest.getTotalAmount());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setNotes(orderRequest.getNotes());

        // Set shipping information
        CreateOrderRequest.ShippingInfo shipping = orderRequest.getShippingInfo();
        order.setShippingFullName(shipping.getFullName());
        order.setShippingEmail(shipping.getEmail());
        order.setShippingPhone(shipping.getPhone());
        order.setShippingAddress(shipping.getAddress());
        order.setShippingCity(shipping.getCity());
        order.setShippingPostalCode(shipping.getPostalCode());
        order.setShippingCountry(shipping.getCountry());

        // Create order items
        for (CreateOrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId().intValue())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemRequest.getQuantity());
            
            // Calculate price at purchase
            orderItem.setPriceAtPurchase(product.getPrice());
            orderItem.setSubtotal(orderItem.getPriceAtPurchase().multiply(
                    java.math.BigDecimal.valueOf(itemRequest.getQuantity())));
            orderItem.setShippingCost(java.math.BigDecimal.ZERO); // Default shipping cost
            
            // Set product image URL with full path
            if (product.getImagePath() != null && !product.getImagePath().isEmpty()) {
                String imageUrl = "http://localhost:8080/" + product.getImagePath();
                orderItem.setProductImageUrl(imageUrl);
            }

            order.getOrderItems().add(orderItem);
        }

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Clear cart items after successful order
        try {
            if (order.getUser() != null) {
                Cart cart = cartRepository.findByUser(order.getUser()).orElse(null);
                if (cart != null) {
                    cart.getItems().clear();
                    cartRepository.save(cart);
                }
            } else if (order.getSessionId() != null) {
                Cart cart = cartRepository.findBySessionId(order.getSessionId()).orElse(null);
                if (cart != null) {
                    cart.getItems().clear();
                    cartRepository.save(cart);
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the order
            System.err.println("Failed to clear cart after order: " + e.getMessage());
        }

        return convertToDTO(savedOrder);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatusOrderByCreatedAtDesc(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    public OrderDTO getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDTO(order);
    }

    @Transactional
    public OrderDTO updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);

        // Update timestamps based on status
        if (newStatus == Order.OrderStatus.SHIPPED && order.getShippedAt() == null) {
            order.setShippedAt(LocalDateTime.now());
        } else if (newStatus == Order.OrderStatus.DELIVERED && order.getDeliveredAt() == null) {
            order.setDeliveredAt(LocalDateTime.now());
        }

        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    @Transactional
    public OrderDTO addOrderNotes(Long orderId, String notes) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setNotes(notes);
        Order updatedOrder = orderRepository.save(order);
        return convertToDTO(updatedOrder);
    }

    public List<OrderDTO> getUserOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByUsername(auth.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserName(order.getUser().getUsername());
            dto.setUserEmail(order.getUser().getEmail());
        }

        dto.setItems(order.getOrderItems().stream()
                .map(this::convertItemToDTO)
                .collect(Collectors.toList()));

        dto.setSubtotal(order.getSubtotal());
        dto.setShippingCost(order.getShippingCost());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setShippingFullName(order.getShippingFullName());
        dto.setShippingEmail(order.getShippingEmail());
        dto.setShippingPhone(order.getShippingPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setShippingCity(order.getShippingCity());
        dto.setShippingPostalCode(order.getShippingPostalCode());
        dto.setShippingCountry(order.getShippingCountry());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        dto.setShippedAt(order.getShippedAt());
        dto.setDeliveredAt(order.getDeliveredAt());
        dto.setNotes(order.getNotes());

        return dto;
    }

    private OrderItemDTO convertItemToDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId().longValue());
        dto.setProductName(item.getProductName());
        dto.setQuantity(item.getQuantity());
        dto.setPriceAtPurchase(item.getPriceAtPurchase());
        dto.setSubtotal(item.getSubtotal());
        dto.setShippingCost(item.getShippingCost());
        
        // Handle image URL - convert relative path to full URL if needed
        String imageUrl = item.getProductImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            if (!imageUrl.startsWith("http")) {
                // Old format: relative path like "/uploads/image.jpg" or "uploads/image.jpg"
                imageUrl = "http://localhost:8080/" + (imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl);
            }
            dto.setProductImageUrl(imageUrl);
        }
        
        return dto;
    }
}
