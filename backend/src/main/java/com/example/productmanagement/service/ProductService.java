package com.example.productmanagement.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.productmanagement.dto.ProductDTO;
import com.example.productmanagement.exception.ResourceNotFoundException;
import com.example.productmanagement.model.Product;
import com.example.productmanagement.repository.CartItemRepository;
import com.example.productmanagement.repository.OrderItemRepository;
import com.example.productmanagement.repository.ProductRepository;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CartItemRepository cartItemRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private ModelMapper modelMapper;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public ProductDTO getProductByIdDTO(Integer id) {
        Product product = getProductById(id);
        
        // Use ModelMapper to convert Product to ProductDTO
        ProductDTO dto = modelMapper.map(product, ProductDTO.class);
        
        // Set imageUrl if imagePath exists
        if (product.getImagePath() != null && !product.getImagePath().isEmpty()) {
            String imageUrl = "http://localhost:8080/" + product.getImagePath();
            dto.setImageUrl(imageUrl);
            dto.setImagePath(product.getImagePath());
        }
        
        return dto;
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<ProductDTO> getProductsByCategoryDTO(String category) {
        List<Product> products = productRepository.findByCategory(category);
        return products.stream().map(product -> {
            ProductDTO dto = modelMapper.map(product, ProductDTO.class);
            if (product.getImagePath() != null && !product.getImagePath().isEmpty()) {
                String imageUrl = "http://localhost:8080/" + product.getImagePath();
                dto.setImageUrl(imageUrl);
                dto.setImagePath(product.getImagePath());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public List<Product> getAvailableProducts() {
        return productRepository.findByProductAvailable(true);
    }

    public List<ProductDTO> getAvailableProductsDTO() {
        List<Product> products = productRepository.findByProductAvailable(true);
        return products.stream().map(product -> {
            ProductDTO dto = modelMapper.map(product, ProductDTO.class);
            if (product.getImagePath() != null && !product.getImagePath().isEmpty()) {
                String imageUrl = "http://localhost:8080/" + product.getImagePath();
                dto.setImageUrl(imageUrl);
                dto.setImagePath(product.getImagePath());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> searchByBrand(String brand) {
        return productRepository.findByBrandContainingIgnoreCase(brand);
    }

    public Product updateProduct(Integer id, Product productDetails) {
        Product product = getProductById(id);

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setBrand(productDetails.getBrand());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setProductAvailable(productDetails.isProductAvailable());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setSpecifications(productDetails.getSpecifications());
        product.setWarranty(productDetails.getWarranty());
        product.setCondition(productDetails.getCondition());
        product.setImagePath(productDetails.getImagePath());

        return productRepository.save(product);
    }

    public Product updateProductFromDTO(Integer id, ProductDTO dto) {
        Product existingProduct = getProductById(id);
        
        // Use ModelMapper to map DTO to existing Product (ignoring null values)
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(dto, existingProduct);
        
        return productRepository.save(existingProduct);
    }

    @Transactional
    public void deleteProduct(Integer id) {
        Product product = getProductById(id);
        
        // First, delete all cart items that reference this product
        // This prevents foreign key constraint violations
        try {
            cartItemRepository.deleteByProductId(id);
        } catch (Exception e) {
            // Log but continue - in case there are no cart items
            System.out.println("No cart items to delete for product " + id);
        }
        
        // Check if product is part of any orders
        // Note: In a production system, you might want to prevent deletion
        // of products that are in orders, or just mark them as inactive
        try {
            orderItemRepository.deleteByProductId(id);
        } catch (Exception e) {
            System.out.println("No order items to delete for product " + id);
        }
        
        // Now delete the product
        productRepository.delete(product);
    }

    public Product createProductWithImage(
            String name, String description, String brand, String price,
            String category, boolean productAvailable,
            int stockQuantity, String specifications, String warranty, String condition,
            MultipartFile imageFile) throws IOException {

        Product product = new Product();
        
        // Basic fields
        product.setName(name);
        product.setDescription(description);
        product.setBrand(brand);
        if (price != null && !price.isEmpty()) {
            product.setPrice(new BigDecimal(price));
        }
        product.setCategory(category);
        product.setProductAvailable(productAvailable);
        product.setStockQuantity(stockQuantity);
        
        // Simplified fields for small laptop shop
        product.setSpecifications(specifications);
        product.setWarranty(warranty);
        product.setCondition(condition != null && !condition.isEmpty() ? condition : "NEW");
        
        // Handle image file - store to uploads folder
        if (imageFile != null && !imageFile.isEmpty()) {
            FileStorageService fileStorageService = new FileStorageService();
            String imagePath = fileStorageService.storeFile(imageFile);
            product.setImagePath(imagePath);
        }

        return productRepository.save(product);
    }

    // OLD METHOD - DEPRECATED: Use file-based storage instead
    // public Product createProductWithImage(...) { ... }

    public List<ProductDTO> getAllProductsWithImage() {
        List<Product> products = productRepository.findAll();
        
        return products.stream().map(product -> {
            // Use ModelMapper to map Product to ProductDTO
            ProductDTO dto = modelMapper.map(product, ProductDTO.class);
            
            // Set imageUrl if imagePath exists
            if (product.getImagePath() != null && !product.getImagePath().isEmpty()) {
                // Convert relative path to full URL
                String imageUrl = "http://localhost:8080/" + product.getImagePath();
                dto.setImageUrl(imageUrl);
                dto.setImagePath(product.getImagePath());
            }
            
            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Update existing product with all fields including image
     */
    @Transactional
    public Product updateProductWithImage(
            Integer id,
            String name, String description, String brand, String price,
            String category, Boolean productAvailable, Integer stockQuantity,
            String specifications, String warranty, String condition,
            MultipartFile imageFile,
            FileStorageService fileStorageService) throws IOException {

        // Get existing product
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update basic fields if provided
        if (name != null && !name.isEmpty()) {
            product.setName(name);
        }
        if (description != null) {
            product.setDescription(description);
        }
        if (brand != null && !brand.isEmpty()) {
            product.setBrand(brand);
        }
        if (price != null && !price.isEmpty()) {
            product.setPrice(new BigDecimal(price));
        }
        if (category != null && !category.isEmpty()) {
            product.setCategory(category);
        }
        if (productAvailable != null) {
            product.setProductAvailable(productAvailable);
        }
        if (stockQuantity != null) {
            product.setStockQuantity(stockQuantity);
        }
        if (specifications != null) {
            product.setSpecifications(specifications);
        }
        if (warranty != null) {
            product.setWarranty(warranty);
        }
        if (condition != null) {
            product.setCondition(condition);
        }

        // Handle image update
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image if exists
            if (product.getImagePath() != null && !product.getImagePath().isEmpty()) {
                try {
                    fileStorageService.deleteFile(product.getImagePath());
                } catch (Exception e) {
                    System.out.println("Could not delete old image: " + e.getMessage());
                }
            }
            
            // Store new image
            String imagePath = fileStorageService.storeFile(imageFile);
            product.setImagePath(imagePath);
        }

        return productRepository.save(product);
    }

}
