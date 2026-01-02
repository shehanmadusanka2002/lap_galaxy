package com.example.productmanagement.controller;

import java.io.IOException;
import java.util.List;

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
import com.example.productmanagement.exception.ResourceNotFoundException;
import com.example.productmanagement.model.Product;
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
    private FileStorageService fileStorageService;

    @GetMapping("/all")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsWithImage());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductByIdDTO(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategoryDTO(category));
    }

    @GetMapping("/available")
    public ResponseEntity<List<ProductDTO>> getAvailableProducts() {
        return ResponseEntity.ok(productService.getAvailableProductsDTO());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody ProductDTO dto) {
        productService.updateProductFromDTO(id, dto);
        return ResponseEntity.ok("Product updated successfully!");
    }

    @PutMapping(value = "/update-with-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProductWithImage(
            @PathVariable Integer id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "price", required = false) String price,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "productAvailable", required = false) Boolean productAvailable,
            @RequestParam(value = "stockQuantity", required = false) Integer stockQuantity,
            @RequestParam(value = "specifications", required = false) String specifications,
            @RequestParam(value = "warranty", required = false) String warranty,
            @RequestParam(value = "condition", required = false) String condition,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {

        try {
            Product updatedProduct = productService.updateProductWithImage(
                    id, name, description, brand, price, category,
                    productAvailable, stockQuantity,
                    specifications, warranty, condition,
                    imageFile, fileStorageService
            );

            return ResponseEntity.ok(updatedProduct);
        } catch (IOException | ResourceNotFoundException e) {
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
            @RequestParam("productAvailable") boolean productAvailable,
            @RequestParam("stockQuantity") int stockQuantity,
            @RequestParam(value = "specifications", required = false) String specifications,
            @RequestParam(value = "warranty", required = false) String warranty,
            @RequestParam(value = "condition", required = false) String condition,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        Product product = productService.createProductWithImage(
                name, description, brand, price, category,
                productAvailable, stockQuantity, specifications, warranty, condition, imageFile
        );

        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchByBrand(@RequestParam String brand) {
        return ResponseEntity.ok(productService.searchByBrand(brand));
    }
}