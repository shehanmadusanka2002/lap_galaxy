package com.example.productmanagement.controller;

import com.example.productmanagement.model.Product;
import com.example.productmanagement.repository.ProductRepository;
import com.example.productmanagement.service.ProductService;
import com.example.productmanagement.dto.ProductDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.Optional;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/products")
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsWithImage());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        ProductDTO dto = new ProductDTO(product);
        return ResponseEntity.ok(dto);
    }





    {/*@GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }*/}

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {
        return ResponseEntity.ok(productService.getAvailableProducts());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody ProductDTO dto) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product existingProduct = optionalProduct.get();

        // Update only allowed fields (image not included, so leave it as-is)
        existingProduct.setName(dto.getName());
        existingProduct.setBrand(dto.getBrand());
        existingProduct.setCategory(dto.getCategory());
        existingProduct.setDescription(dto.getDescription());
        existingProduct.setPrice(dto.getPrice());
        existingProduct.setStockQuantity(dto.getStockQuantity());
        existingProduct.setProductAvailable(dto.getproductAvailable());
        existingProduct.setReleaseDate(dto.getReleaseDate());

        // Don't touch imageBase64 or imageType fields here

        productRepository.save(existingProduct);
        return ResponseEntity.ok("Product updated successfully!");
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    // Existing methods remain the same...

    // New endpoints for handling images

    // 1. Upload image for an existing product
    @PostMapping("/{id}/image")
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

    // 2. Create product with image using multipart form
    @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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

    // 3. Get product image
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

    @GetMapping("/search")
    public List<Product> searchByBrand(@RequestParam String brand) {
        return productRepository.findByBrandContainingIgnoreCase(brand);
    }
}