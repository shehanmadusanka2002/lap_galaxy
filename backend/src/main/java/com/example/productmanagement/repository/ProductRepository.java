package com.example.productmanagement.repository;

import com.example.productmanagement.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategory(String category);
    List<Product> findByProductAvailable(boolean available);
    List<Product> findByBrand(String brand);

    // Method name-based query
    List<Product> findByBrandContainingIgnoreCase(String brand);

    // OR with @Query
    // @Query("SELECT p FROM Product p WHERE LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%'))")
    // List<Product> searchByBrand(@Param("brand") String brand);
}