package com.example.productmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.productmanagement.model.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    List<CartItem> findByCartId(Long cartId);
    
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Integer productId);
    
    void deleteByCartId(Long cartId);
    
    // Delete all cart items for a specific product
    void deleteByProductId(Integer productId);
    
    // Find all cart items for a specific product
    List<CartItem> findByProductId(Integer productId);
}
