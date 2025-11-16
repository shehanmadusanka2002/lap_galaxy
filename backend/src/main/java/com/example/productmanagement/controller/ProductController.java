package com.example.productmanagement.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.productmanagement.dto.ProductDTO;
import com.example.productmanagement.model.Product;
import com.example.productmanagement.repository.ProductRepository;
import com.example.productmanagement.service.FileStorageService;
import com.example.productmanagement.service.ProductService;

import jakarta.validation.Valid;


@CrossOrigin(origins = "http://localhost:5173,http://localhost:5174")
@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/all")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsWithImage());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        
        // Use ModelMapper to convert Product to ProductDTO
        ProductDTO dto = modelMapper.map(product, ProductDTO.class);
        
        // Set imageUrl if imagePath exists
        if (product.getImagePath() != null && !product.getImagePath().isEmpty()) {
            String imageUrl = "http://localhost:8080/" + product.getImagePath();
            dto.setImageUrl(imageUrl);
            dto.setImagePath(product.getImagePath());
        }
        
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {
        return ResponseEntity.ok(productService.getAvailableProducts());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody ProductDTO dto) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product existingProduct = optionalProduct.get();
        
        // Use ModelMapper to map DTO to existing Product (ignoring null values)
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(dto, existingProduct);
        
        // Note: Image data should be handled separately via the image upload endpoint
        productRepository.save(existingProduct);
        return ResponseEntity.ok("Product updated successfully!");
    }

    @PutMapping(value = "/update-with-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProductWithImage(
            @PathVariable Integer id,
            // Basic fields
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "price", required = false) String price,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "releaseDate", required = false) String releaseDate,
            @RequestParam(value = "productAvailable", required = false) Boolean productAvailable,
            @RequestParam(value = "stockQuantity", required = false) Integer stockQuantity,
            
            // Product Specifications
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "model", required = false) String model,
            @RequestParam(value = "specifications", required = false) String specifications,
            @RequestParam(value = "warranty", required = false) String warranty,
            @RequestParam(value = "condition", required = false) String condition,
            
            // Pricing
            @RequestParam(value = "originalPrice", required = false) String originalPrice,
            @RequestParam(value = "discountPercentage", required = false) Integer discountPercentage,
            @RequestParam(value = "shippingCost", required = false) String shippingCost,
            @RequestParam(value = "freeShipping", required = false) Boolean freeShipping,
            
            // Product Details
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "weight", required = false) String weight,
            @RequestParam(value = "dimensions", required = false) String dimensions,
            
            // Seller & Origin
            @RequestParam(value = "seller", required = false) String seller,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "manufacturer", required = false) String manufacturer,
            
            // Rating & Reviews
            @RequestParam(value = "rating", required = false) String rating,
            @RequestParam(value = "reviewCount", required = false) Integer reviewCount,
            
            // Stock Management
            @RequestParam(value = "minOrderQuantity", required = false) Integer minOrderQuantity,
            @RequestParam(value = "maxOrderQuantity", required = false) Integer maxOrderQuantity,
            @RequestParam(value = "featured", required = false) Boolean featured,
            @RequestParam(value = "bestSeller", required = false) Boolean bestSeller,
            
            // Tags & Keywords
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "keywords", required = false) String keywords,
            @RequestParam(value = "status", required = false) String status,
            
            // Image
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        try {
            Product updatedProduct = productService.updateProductWithImage(
                    id, name, description, brand, price, category, releaseDate,
                    productAvailable, stockQuantity,
                    sku, model, specifications, warranty, condition,
                    originalPrice, discountPercentage, shippingCost, freeShipping,
                    color, size, weight, dimensions,
                    seller, origin, manufacturer,
                    rating, reviewCount,
                    minOrderQuantity, maxOrderQuantity,
                    featured, bestSeller,
                    tags, keywords, status,
                    imageFile, fileStorageService
            );

            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Image handling endpoints - DEPRECATED (using file-based storage now)
    /*
    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> uploadProductImage(
            @PathVariable Integer id,
            @RequestParam("image") MultipartFile imageFile) throws IOException {

        Product updatedProduct = productService.updateProductImage(
                id,
                imageFile.getOriginalFilename(),
                imageFile.getContentType(),
                imageFile.getBytes()
        );

        return ResponseEntity.ok(updatedProduct);
    }
    */

    @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProductWithImage(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("brand") String brand,
            @RequestParam("price") String price,
            @RequestParam("category") String category,
            @RequestParam(value = "releaseDate", required = false) String releaseDate,
            @RequestParam("productAvailable") boolean productAvailable,
            @RequestParam("stockQuantity") int stockQuantity,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        Product product = productService.createProductWithImage(
                name, description, brand, price, category, releaseDate,
                productAvailable, stockQuantity, imageFile
        );

        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }
    
    @PostMapping(value = "/create-advanced", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAdvancedProduct(
            // Basic fields
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("brand") String brand,
            @RequestParam("price") String price,
            @RequestParam("category") String category,
            @RequestParam(value = "releaseDate", required = false) String releaseDate,
            @RequestParam("productAvailable") boolean productAvailable,
            @RequestParam("stockQuantity") int stockQuantity,
            
            // New industrial fields
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "model", required = false) String model,
            @RequestParam(value = "specifications", required = false) String specifications,
            @RequestParam(value = "warranty", required = false) String warranty,
            @RequestParam(value = "condition", required = false) String condition,
            @RequestParam(value = "originalPrice", required = false) String originalPrice,
            @RequestParam(value = "discountPercentage", required = false) Integer discountPercentage,
            @RequestParam(value = "shippingCost", required = false) String shippingCost,
            @RequestParam(value = "freeShipping", required = false) Boolean freeShipping,
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "weight", required = false) String weight,
            @RequestParam(value = "dimensions", required = false) String dimensions,
            @RequestParam(value = "seller", required = false) String seller,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "manufacturer", required = false) String manufacturer,
            @RequestParam(value = "rating", required = false) String rating,
            @RequestParam(value = "reviewCount", required = false) Integer reviewCount,
            @RequestParam(value = "minOrderQuantity", required = false) Integer minOrderQuantity,
            @RequestParam(value = "maxOrderQuantity", required = false) Integer maxOrderQuantity,
            @RequestParam(value = "featured", required = false) Boolean featured,
            @RequestParam(value = "bestSeller", required = false) Boolean bestSeller,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "keywords", required = false) String keywords,
            @RequestParam(value = "status", required = false) String status,
            
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        Product product = productService.createAdvancedProduct(
                name, description, brand, price, category, releaseDate,
                productAvailable, stockQuantity, 
                sku, model, specifications, warranty, condition,
                originalPrice, discountPercentage, shippingCost, freeShipping,
                color, size, weight, dimensions,
                seller, origin, manufacturer,
                rating, reviewCount,
                minOrderQuantity, maxOrderQuantity,
                featured, bestSeller,
                tags, keywords, status,
                imageFile
        );

        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    // DEPRECATED: Using file-based storage now, images served via /uploads/** endpoint
    /*
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Integer id) {
        Product product = productService.getProductById(id);

        if (product.getImageData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(product.getImageType()))
                .body(product.getImageData());
    }
    */

    @GetMapping("/search")
    public List<Product> searchByBrand(@RequestParam String brand) {
        return productRepository.findByBrandContainingIgnoreCase(brand);
    }

    /**
     * Create product with multiple images stored as files (up to 5 images)
     * Images are saved in uploads folder, only paths stored in database
     */
    @PostMapping(value = "/create-with-file-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProductWithFileImages(
            // Basic fields
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("brand") String brand,
            @RequestParam("price") String price,
            @RequestParam("category") String category,
            @RequestParam(value = "releaseDate", required = false) String releaseDate,
            @RequestParam(value = "productAvailable", defaultValue = "true") boolean productAvailable,
            @RequestParam("stockQuantity") int stockQuantity,
            
            // Product Specifications
            @RequestParam(value = "sku", required = false) String sku,
            @RequestParam(value = "model", required = false) String model,
            @RequestParam(value = "specifications", required = false) String specifications, // Point form text
            @RequestParam(value = "warranty", required = false) String warranty,
            @RequestParam(value = "condition", required = false) String condition,
            
            // Pricing
            @RequestParam(value = "originalPrice", required = false) String originalPrice,
            @RequestParam(value = "discountPercentage", required = false) Integer discountPercentage,
            @RequestParam(value = "shippingCost", required = false) String shippingCost,
            @RequestParam(value = "freeShipping", required = false) Boolean freeShipping,
            
            // Product Details
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "weight", required = false) String weight,
            @RequestParam(value = "dimensions", required = false) String dimensions,
            
            // Seller & Origin
            @RequestParam(value = "seller", required = false) String seller,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "manufacturer", required = false) String manufacturer,
            
            // Rating & Reviews
            @RequestParam(value = "rating", required = false) String rating,
            @RequestParam(value = "reviewCount", required = false) Integer reviewCount,
            
            // Stock Management
            @RequestParam(value = "minOrderQuantity", required = false) Integer minOrderQuantity,
            @RequestParam(value = "maxOrderQuantity", required = false) Integer maxOrderQuantity,
            @RequestParam(value = "featured", required = false) Boolean featured,
            @RequestParam(value = "bestSeller", required = false) Boolean bestSeller,
            
            // Tags & Keywords
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "keywords", required = false) String keywords,
            @RequestParam(value = "status", required = false) String status,
            
            // Main image + up to 4 additional images (total 5)
            @RequestParam(value = "mainImage", required = false) MultipartFile mainImage,
            @RequestParam(value = "image1", required = false) MultipartFile image1,
            @RequestParam(value = "image2", required = false) MultipartFile image2,
            @RequestParam(value = "image3", required = false) MultipartFile image3,
            @RequestParam(value = "image4", required = false) MultipartFile image4) {

        try {
            Product product = productService.createProductWithFileImages(
                    name, description, brand, price, category, releaseDate,
                    productAvailable, stockQuantity,
                    sku, model, specifications, warranty, condition,
                    originalPrice, discountPercentage, shippingCost, freeShipping,
                    color, size, weight, dimensions,
                    seller, origin, manufacturer,
                    rating, reviewCount,
                    minOrderQuantity, maxOrderQuantity,
                    featured, bestSeller,
                    tags, keywords, status,
                    mainImage, image1, image2, image3, image4,
                    fileStorageService
            );

            return new ResponseEntity<>(product, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating product: " + e.getMessage());
        }
    }
}