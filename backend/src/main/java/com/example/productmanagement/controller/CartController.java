package com.example.productmanagement.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.productmanagement.config.JwtUtil;
import com.example.productmanagement.dto.AddToCartRequest;
import com.example.productmanagement.dto.CartDTO;
import com.example.productmanagement.model.User;
import com.example.productmanagement.repository.UserRepository;
import com.example.productmanagement.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    /**
     * Add item to cart
     */
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody AddToCartRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        try {
            Long userId = extractUserIdFromToken(authHeader);
            CartDTO cart = cartService.addToCart(request, userId);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add item to cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get cart (for authenticated user or guest)
     */
    @GetMapping
    public ResponseEntity<?> getCart(
            @RequestParam(required = false) String sessionId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        try {
            Long userId = extractUserIdFromToken(authHeader);
            
            CartDTO cart;
            if (userId != null) {
                cart = cartService.getCartByUserId(userId);
            } else if (sessionId != null) {
                cart = cartService.getCartBySessionId(sessionId);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Either authentication or sessionId is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to retrieve cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update cart item quantity
     */
    @PutMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable Long cartId,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        
        try {
            CartDTO cart = cartService.updateCartItemQuantity(cartId, itemId, quantity);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update cart item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Remove item from cart
     */
    @DeleteMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long cartId,
            @PathVariable Long itemId) {
        
        try {
            CartDTO cart = cartService.removeFromCart(cartId, itemId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to remove item from cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Clear cart
     */
    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable Long cartId) {
        try {
            cartService.clearCart(cartId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cart cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Merge guest cart with user cart after login
     */
    @PostMapping("/merge")
    public ResponseEntity<?> mergeCart(
            @RequestParam String sessionId,
            @RequestHeader("Authorization") String authHeader) {
        
        try {
            Long userId = extractUserIdFromToken(authHeader);
            if (userId == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Authentication required");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
            
            CartDTO cart = cartService.mergeGuestCartWithUserCart(sessionId, userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to merge carts: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Extract user ID from JWT token
     */
    private Long extractUserIdFromToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                String username = jwtUtil.extractUsername(token);
                
                // Get user ID from username
                User user = userRepository.findByUsername(username).orElse(null);
                if (user != null) {
                    return user.getId();
                }
            } catch (Exception e) {
                System.err.println("Error extracting user from token: " + e.getMessage());
            }
        }
        return null;
    }
}
