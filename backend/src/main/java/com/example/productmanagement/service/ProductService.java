package com.example.productmanagement.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.productmanagement.dto.ProductDTO;
import com.example.productmanagement.exception.ResourceNotFoundException;
import com.example.productmanagement.model.Product;
import com.example.productmanagement.repository.ProductRepository;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ModelMapper modelMapper;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> getAvailableProducts() {
        return productRepository.findByProductAvailable(true);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Integer id, Product productDetails) {
        Product product = getProductById(id);

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setBrand(productDetails.getBrand());
        product.setPrice(productDetails.getPrice());
        product.setCategory(productDetails.getCategory());
        product.setReleaseDate(productDetails.getReleaseDate());
        product.setProductAvailable(productDetails.isProductAvailable());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImagePath(productDetails.getImagePath());
        product.setAdditionalImagePaths(productDetails.getAdditionalImagePaths());

        return productRepository.save(product);
    }

    public void deleteProduct(Integer id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }

    // OLD METHOD - DEPRECATED: Use file-based storage instead
    // public Product createProductWithImage(...) { ... }

    public List<ProductDTO> getAllProductsWithImage() {
        List<Product> products = productRepository.findAll();
        
        return products.stream().map(product -> {
            // Use ModelMapper to map Product to ProductDTO
            ProductDTO dto = modelMapper.map(product, ProductDTO.class);
            
            // Image paths are already in the DTO through mapping
            // No need for Base64 conversion - frontend will load from file paths
            
            return dto;
        }).collect(Collectors.toList());
    }

    public Product findById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public Product createAdvancedProduct(
            String name, String description, String brand, String price,
            String category, String releaseDateStr, boolean productAvailable,
            int stockQuantity,
            // New industrial fields
            String sku, String model, String specifications, String warranty, String condition,
            String originalPrice, Integer discountPercentage, String shippingCost, Boolean freeShipping,
            String color, String size, String weight, String dimensions,
            String seller, String origin, String manufacturer,
            String rating, Integer reviewCount,
            Integer minOrderQuantity, Integer maxOrderQuantity,
            Boolean featured, Boolean bestSeller,
            String tags, String keywords, String status,
            MultipartFile imageFile) throws IOException {

        Product product = new Product();
        
        // Basic fields
        product.setName(name);
        product.setDescription(description);
        product.setBrand(brand);
        product.setPrice(new BigDecimal(price));
        product.setCategory(category);
        product.setProductAvailable(productAvailable);
        product.setStockQuantity(stockQuantity);

        // Parse release date if provided
        if (releaseDateStr != null && !releaseDateStr.isEmpty()) {
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date releaseDate = dateFormat.parse(releaseDateStr);
                product.setReleaseDate(releaseDate);
            } catch (ParseException e) {
                throw new IllegalArgumentException("Invalid date format. Use yyyy-MM-dd");
            }
        }

        // New industrial fields
        product.setSku(sku);
        product.setModel(model);
        product.setSpecifications(specifications);
        product.setWarranty(warranty);
        product.setCondition(condition != null ? condition : "NEW");
        
        if (originalPrice != null && !originalPrice.isEmpty()) {
            product.setOriginalPrice(new BigDecimal(originalPrice));
        }
        product.setDiscountPercentage(discountPercentage);
        if (shippingCost != null && !shippingCost.isEmpty()) {
            product.setShippingCost(new BigDecimal(shippingCost));
        }
        product.setFreeShipping(freeShipping != null ? freeShipping : false);
        
        product.setColor(color);
        product.setSize(size);
        if (weight != null && !weight.isEmpty()) {
            product.setWeight(new BigDecimal(weight));
        }
        product.setDimensions(dimensions);
        
        product.setSeller(seller);
        product.setOrigin(origin);
        product.setManufacturer(manufacturer);
        
        if (rating != null && !rating.isEmpty()) {
            product.setRating(new BigDecimal(rating));
        }
        product.setReviewCount(reviewCount != null ? reviewCount : 0);
        
        product.setMinOrderQuantity(minOrderQuantity != null ? minOrderQuantity : 1);
        product.setMaxOrderQuantity(maxOrderQuantity);
        product.setInStock(stockQuantity > 0);
        product.setFeatured(featured != null ? featured : false);
        product.setBestSeller(bestSeller != null ? bestSeller : false);
        
        product.setTags(tags);
        product.setKeywords(keywords);
        product.setStatus(status != null ? status : "ACTIVE");

        // DEPRECATED: Image storage changed to file-based system
        // Use createProductWithFileImages() method instead for image uploads

        return productRepository.save(product);
    }

    /**
     * Create product with file-based images (stored in uploads folder)
     */
    public Product createProductWithFileImages(
            String name, String description, String brand, String price, String category,
            String releaseDate, boolean productAvailable, int stockQuantity,
            String sku, String model, String specifications, String warranty, String condition,
            String originalPrice, Integer discountPercentage, String shippingCost, Boolean freeShipping,
            String color, String size, String weight, String dimensions,
            String seller, String origin, String manufacturer,
            String rating, Integer reviewCount,
            Integer minOrderQuantity, Integer maxOrderQuantity,
            Boolean featured, Boolean bestSeller,
            String tags, String keywords, String status,
            MultipartFile mainImage, MultipartFile image1, MultipartFile image2,
            MultipartFile image3, MultipartFile image4,
            FileStorageService fileStorageService) throws IOException {

        Product product = new Product();
        
        // Basic fields
        product.setName(name);
        product.setDescription(description);
        product.setBrand(brand);
        product.setPrice(new BigDecimal(price));
        product.setCategory(category);
        product.setProductAvailable(productAvailable);
        product.setStockQuantity(stockQuantity);
        
        // Product Specifications  
        product.setSku(sku);
        product.setModel(model);
        product.setSpecifications(specifications); // Point form text
        product.setWarranty(warranty);
        product.setCondition(condition);
        
        // Pricing
        if (originalPrice != null && !originalPrice.isEmpty()) {
            product.setOriginalPrice(new BigDecimal(originalPrice));
        }
        product.setDiscountPercentage(discountPercentage);
        if (shippingCost != null && !shippingCost.isEmpty()) {
            product.setShippingCost(new BigDecimal(shippingCost));
        }
        product.setFreeShipping(freeShipping != null ? freeShipping : false);
        
        // Product Details
        product.setColor(color);
        product.setSize(size);
        if (weight != null && !weight.isEmpty()) {
            product.setWeight(new BigDecimal(weight));
        }
        product.setDimensions(dimensions);
        
        // Seller & Origin
        product.setSeller(seller);
        product.setOrigin(origin);
        product.setManufacturer(manufacturer);
        
        // Rating & Reviews
        if (rating != null && !rating.isEmpty()) {
            product.setRating(new BigDecimal(rating));
        }
        product.setReviewCount(reviewCount != null ? reviewCount : 0);
        
        // Stock Management
        product.setMinOrderQuantity(minOrderQuantity != null ? minOrderQuantity : 1);
        product.setMaxOrderQuantity(maxOrderQuantity);
        product.setInStock(stockQuantity > 0);
        product.setFeatured(featured != null ? featured : false);
        product.setBestSeller(bestSeller != null ? bestSeller : false);
        
        // Tags & Keywords
        product.setTags(tags);
        product.setKeywords(keywords);
        product.setStatus(status != null ? status : "ACTIVE");

        // Handle main image
        if (mainImage != null && !mainImage.isEmpty()) {
            String imagePath = fileStorageService.storeFile(mainImage);
            product.setImagePath(imagePath);
        }

        // Handle additional images (up to 4)
        StringBuilder additionalPaths = new StringBuilder();
        MultipartFile[] additionalImages = {image1, image2, image3, image4};
        
        for (MultipartFile img : additionalImages) {
            if (img != null && !img.isEmpty()) {
                String path = fileStorageService.storeFile(img);
                if (additionalPaths.length() > 0) {
                    additionalPaths.append(",");
                }
                additionalPaths.append(path);
            }
        }
        
        if (additionalPaths.length() > 0) {
            product.setAdditionalImagePaths(additionalPaths.toString());
        }

        return productRepository.save(product);
    }

}
