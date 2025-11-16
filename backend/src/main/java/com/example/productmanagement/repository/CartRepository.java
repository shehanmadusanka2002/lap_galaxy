package com.example.productmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.productmanagement.model.Cart;
import com.example.productmanagement.model.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    Optional<Cart> findByUser(User user);
    
    Optional<Cart> findByUserId(Long userId);
    
    Optional<Cart> findBySessionId(String sessionId);
    
    void deleteByUserId(Long userId);
    
    void deleteBySessionId(String sessionId);
}
