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

    private String imageName;

    private String imageType;

    @Lob
    // Explicitly suggest a column type capable of holding large binary data.
    // Use LONGBLOB for MySQL, BYTEA for PostgreSQL, or adjust as needed for your DB.
    // IMPORTANT: Ensure the actual DB column is altered if not using ddl-auto=update/create.
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;

}