package com.example.productmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Temporal(TemporalType.DATE)
    private Date releaseDate;

    private boolean productAvailable;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    // Main product image (file path)
    private String imagePath;

    // Additional product images (file paths, comma-separated, max 4 additional images)
    @Column(length = 1000)
    private String additionalImagePaths; // Comma-separated file paths: uploads/img1.jpg,uploads/img2.jpg,uploads/img3.jpg,uploads/img4.jpg

    // ========== Industrial-Level E-commerce Fields (like Daraz) ==========
    
    // Product Specifications
    @Column(length = 100)
    private String sku; // Stock Keeping Unit - unique product identifier
    
    @Column(length = 50)
    private String model; // Model number/name
    
    @Lob
    @Column(columnDefinition = "TEXT")
    private String specifications; // Point form specifications (bullet points, one per line)
    
    @Column(length = 500)
    private String warranty; // Warranty information
    
    @Column(name = "`condition`", length = 100)
    private String condition; // NEW, REFURBISHED, USED
    
    // Pricing & Discounts
    private BigDecimal originalPrice; // Original price before discount
    
    @Min(value = 0, message = "Discount percentage must be between 0 and 100")
    @Max(value = 100, message = "Discount percentage must be between 0 and 100")
    private Integer discountPercentage; // Discount %
    
    private BigDecimal shippingCost; // Shipping cost
    
    private Boolean freeShipping; // Free shipping available
    
    // Product Details
    @Column(length = 100)
    private String color; // Product color
    
    @Column(length = 50)
    private String size; // Product size (if applicable)
    
    @DecimalMin(value = "0.0", message = "Weight must be positive")
    private BigDecimal weight; // Product weight in kg
    
    @Column(length = 100)
    private String dimensions; // Product dimensions (L x W x H)
    
    // Seller & Origin
    @Column(length = 100)
    private String seller; // Seller name
    
    @Column(length = 100)
    private String origin; // Country of origin
    
    @Column(length = 100)
    private String manufacturer; // Manufacturer name
    
    // Rating & Reviews
    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMax(value = "5.0", message = "Rating must be between 0 and 5")
    private BigDecimal rating; // Average rating (0-5)
    
    @Min(value = 0, message = "Review count cannot be negative")
    private Integer reviewCount; // Number of reviews
    
    // Stock Management
    @Min(value = 0, message = "Minimum order quantity cannot be negative")
    private Integer minOrderQuantity; // Minimum order quantity
    
    @Min(value = 0, message = "Maximum order quantity cannot be negative")
    private Integer maxOrderQuantity; // Maximum order quantity per order
    
    private Boolean inStock; // Is product in stock
    
    private Boolean featured; // Is featured product
    
    private Boolean bestSeller; // Is best seller
    
    // Tags & Keywords
    @Column(length = 500)
    private String tags; // Search tags (comma-separated)
    
    @Column(length = 500)
    private String keywords; // SEO keywords
    
    // Timestamps
    @Column(updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    @Column(length = 100)
    private String createdBy; // Admin username who created the product
    
    @Column(length = 100)
    private String updatedBy; // Admin username who last updated
    
    // Product Status
    @Column(length = 50)
    private String status; // ACTIVE, INACTIVE, OUT_OF_STOCK, DISCONTINUED
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
        if (inStock == null) {
            inStock = stockQuantity != null && stockQuantity > 0;
        }
        if (status == null) {
            status = "ACTIVE";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
        if (stockQuantity != null) {
            inStock = stockQuantity > 0;
        }
    }



}