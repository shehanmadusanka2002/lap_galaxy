package com.example.productmanagement.dto;

import com.example.productmanagement.model.Product;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductDTO {

    private Integer id;

    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Category is required")
    private String category;

    private Date releaseDate;

    private boolean productAvailable;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private String imageName;

    private String imageBase64;

    // ========== Industrial-Level E-commerce Fields ==========
    
    // Product Specifications
    private String sku;
    private String model;
    private String specifications;
    private String warranty;
    private String condition;
    
    // Pricing & Discounts
    private BigDecimal originalPrice;
    private Integer discountPercentage;
    private BigDecimal shippingCost;
    private Boolean freeShipping;
    
    // Product Details
    private String color;
    private String size;
    private BigDecimal weight;
    private String dimensions;
    
    // Seller & Origin
    private String seller;
    private String origin;
    private String manufacturer;
    
    // Rating & Reviews
    private BigDecimal rating;
    private Integer reviewCount;
    
    // Stock Management
    private Integer minOrderQuantity;
    private Integer maxOrderQuantity;
    private Boolean inStock;
    private Boolean featured;
    private Boolean bestSeller;
    
    // Tags & Keywords
    private String tags;
    private String keywords;
    
    // Additional Images
    private String additionalImages;
    
    // Timestamps
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    private String updatedBy;
    
    // Product Status
    private String status;

    public boolean getproductAvailable() {
        return productAvailable;
    }
}
