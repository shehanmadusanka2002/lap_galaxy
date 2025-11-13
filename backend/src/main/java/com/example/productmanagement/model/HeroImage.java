package com.example.productmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "hero_images")
public class HeroImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    
    private String description;
    
    private String buttonText;
    
    private String buttonLink;
    
    private String imageName;
    
    private String imageType;
    
    @Lob
    @Column(name = "image_data", columnDefinition = "LONGBLOB")
    private byte[] imageData;
    
    private Boolean active; // Whether this hero image is currently active
    
    private Integer displayOrder; // Order in which to display (for multiple heroes)
    
    @Column(updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;
    
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;
    
    private String createdBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
        if (active == null) {
            active = true;
        }
        if (displayOrder == null) {
            displayOrder = 0;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
}
