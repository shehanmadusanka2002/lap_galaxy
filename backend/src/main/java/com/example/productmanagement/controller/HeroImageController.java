package com.example.productmanagement.controller;

import com.example.productmanagement.model.HeroImage;
import com.example.productmanagement.repository.HeroImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hero")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class HeroImageController {

    @Autowired
    private HeroImageRepository heroImageRepository;

    // Get all active hero images (public access)
    @GetMapping("/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveHeroImages() {
        List<HeroImage> heroImages = heroImageRepository.findByActiveTrueOrderByDisplayOrderAsc();
        
        List<Map<String, Object>> response = heroImages.stream().map(hero -> {
            Map<String, Object> heroData = new HashMap<>();
            heroData.put("id", hero.getId());
            heroData.put("title", hero.getTitle());
            heroData.put("description", hero.getDescription());
            heroData.put("buttonText", hero.getButtonText());
            heroData.put("buttonLink", hero.getButtonLink());
            heroData.put("displayOrder", hero.getDisplayOrder());
            
            if (hero.getImageData() != null) {
                String base64Image = Base64.getEncoder().encodeToString(hero.getImageData());
                heroData.put("imageBase64", base64Image);
                heroData.put("imageType", hero.getImageType());
            }
            
            return heroData;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // Get all hero images (admin only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllHeroImages() {
        List<HeroImage> heroImages = heroImageRepository.findAll();
        
        List<Map<String, Object>> response = heroImages.stream().map(hero -> {
            Map<String, Object> heroData = new HashMap<>();
            heroData.put("id", hero.getId());
            heroData.put("title", hero.getTitle());
            heroData.put("description", hero.getDescription());
            heroData.put("buttonText", hero.getButtonText());
            heroData.put("buttonLink", hero.getButtonLink());
            heroData.put("displayOrder", hero.getDisplayOrder());
            heroData.put("active", hero.getActive());
            heroData.put("createdAt", hero.getCreatedAt());
            
            if (hero.getImageData() != null) {
                String base64Image = Base64.getEncoder().encodeToString(hero.getImageData());
                heroData.put("imageBase64", base64Image);
                heroData.put("imageType", hero.getImageType());
            }
            
            return heroData;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    // Upload hero image (admin only)
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadHeroImage(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "buttonText", required = false) String buttonText,
            @RequestParam(value = "buttonLink", required = false) String buttonLink,
            @RequestParam(value = "displayOrder", required = false, defaultValue = "0") Integer displayOrder,
            @RequestParam(value = "active", required = false, defaultValue = "true") Boolean active,
            @RequestParam("image") MultipartFile image) {
        
        try {
            HeroImage heroImage = new HeroImage();
            heroImage.setTitle(title);
            heroImage.setDescription(description);
            heroImage.setButtonText(buttonText);
            heroImage.setButtonLink(buttonLink);
            heroImage.setDisplayOrder(displayOrder);
            heroImage.setActive(active);
            heroImage.setImageName(image.getOriginalFilename());
            heroImage.setImageType(image.getContentType());
            heroImage.setImageData(image.getBytes());
            
            HeroImage saved = heroImageRepository.save(heroImage);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Hero image uploaded successfully", "id", saved.getId()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload hero image: " + e.getMessage()));
        }
    }

    // Update hero image (admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateHeroImage(
            @PathVariable Integer id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "buttonText", required = false) String buttonText,
            @RequestParam(value = "buttonLink", required = false) String buttonLink,
            @RequestParam(value = "displayOrder", required = false) Integer displayOrder,
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        
        return heroImageRepository.findById(id)
                .map(hero -> {
                    if (title != null) hero.setTitle(title);
                    if (description != null) hero.setDescription(description);
                    if (buttonText != null) hero.setButtonText(buttonText);
                    if (buttonLink != null) hero.setButtonLink(buttonLink);
                    if (displayOrder != null) hero.setDisplayOrder(displayOrder);
                    if (active != null) hero.setActive(active);
                    
                    if (image != null && !image.isEmpty()) {
                        try {
                            hero.setImageName(image.getOriginalFilename());
                            hero.setImageType(image.getContentType());
                            hero.setImageData(image.getBytes());
                        } catch (IOException e) {
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body(Map.of("error", "Failed to update image: " + e.getMessage()));
                        }
                    }
                    
                    heroImageRepository.save(hero);
                    return ResponseEntity.ok(Map.of("message", "Hero image updated successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete hero image (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteHeroImage(@PathVariable Integer id) {
        return heroImageRepository.findById(id)
                .map(hero -> {
                    heroImageRepository.delete(hero);
                    return ResponseEntity.ok(Map.of("message", "Hero image deleted successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Toggle active status (admin only)
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleActiveStatus(@PathVariable Integer id) {
        return heroImageRepository.findById(id)
                .map(hero -> {
                    hero.setActive(!hero.getActive());
                    heroImageRepository.save(hero);
                    return ResponseEntity.ok(Map.of("message", "Status toggled", "active", hero.getActive()));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
