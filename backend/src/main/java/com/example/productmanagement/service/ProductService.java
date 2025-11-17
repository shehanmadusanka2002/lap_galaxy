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
        
        // Handle price calculation with discount
        if (productDetails.getOriginalPrice() != null && productDetails.getDiscountPercentage() != null && productDetails.getDiscountPercentage() > 0) {
            BigDecimal discount = productDetails.getOriginalPrice()
                    .multiply(new BigDecimal(productDetails.getDiscountPercentage()))
                    .divide(new BigDecimal(100), 2, BigDecimal.ROUND_HALF_UP);
            BigDecimal discountedPrice = productDetails.getOriginalPrice().subtract(discount);
            product.setPrice(discountedPrice);
        } else {
            product.setPrice(productDetails.getPrice());
        }
        
        product.setCategory(productDetails.getCategory());
        product.setReleaseDate(productDetails.getReleaseDate());
        product.setProductAvailable(productDetails.isProductAvailable());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImagePath(productDetails.getImagePath());
        product.setAdditionalImagePaths(productDetails.getAdditionalImagePaths());

        return productRepository.save(product);
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

    /**
     * Create product with image file
     */
    public Product createProductWithImage(
            String name, String description, String brand, String price,
            String category, String releaseDateStr, boolean productAvailable,
            int stockQuantity, MultipartFile imageFile) throws IOException {

        Product product = new Product();
        
        // Basic fields
        product.setName(name);
        product.setDescription(description);
        product.setBrand(brand);
        // Price will be set later if needed, or from the price parameter
        if (price != null && !price.isEmpty()) {
            product.setPrice(new BigDecimal(price));
        }
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
        // Don't set price here yet - will be calculated below based on discount
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
        
        // Auto-calculate discounted price if both original price and discount are provided
        if (originalPrice != null && !originalPrice.isEmpty() && discountPercentage != null && discountPercentage > 0) {
            BigDecimal originalPriceBD = new BigDecimal(originalPrice);
            BigDecimal discount = originalPriceBD
                    .multiply(new BigDecimal(discountPercentage))
                    .divide(new BigDecimal(100), 2, BigDecimal.ROUND_HALF_UP);
            BigDecimal discountedPrice = originalPriceBD.subtract(discount);
            product.setPrice(discountedPrice);
        } else if (price != null && !price.isEmpty()) {
            // Only use manual price if no discount calculation is needed
            product.setPrice(new BigDecimal(price));
        } else {
            // Default to 0 if no price is provided
            product.setPrice(BigDecimal.ZERO);
        }
        
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

        // Handle image file - store to uploads folder
        if (imageFile != null && !imageFile.isEmpty()) {
            FileStorageService fileStorageService = new FileStorageService();
            String imagePath = fileStorageService.storeFile(imageFile);
            product.setImagePath(imagePath);
        }

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

    /**
     * Update existing product with all fields including image
     */
    @Transactional
    public Product updateProductWithImage(
            Integer id,
            String name, String description, String brand, String price,
            String category, String releaseDateStr, Boolean productAvailable,
            Integer stockQuantity,
            // Product Specifications
            String sku, String model, String specifications, String warranty, String condition,
            // Pricing
            String originalPrice, Integer discountPercentage, String shippingCost, Boolean freeShipping,
            // Product Details
            String color, String size, String weight, String dimensions,
            // Seller & Origin
            String seller, String origin, String manufacturer,
            // Rating & Reviews
            String rating, Integer reviewCount,
            // Stock Management
            Integer minOrderQuantity, Integer maxOrderQuantity,
            Boolean featured, Boolean bestSeller,
            // Tags & Keywords
            String tags, String keywords, String status,
            // Image
            MultipartFile imageFile,
            FileStorageService fileStorageService) throws IOException, ParseException {

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
        
        // Parse release date
        if (releaseDateStr != null && !releaseDateStr.isEmpty()) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            product.setReleaseDate(dateFormat.parse(releaseDateStr));
        }
        
        if (productAvailable != null) {
            product.setProductAvailable(productAvailable);
        }
        if (stockQuantity != null) {
            product.setStockQuantity(stockQuantity);
        }

        // Update Product Specifications
        if (sku != null) product.setSku(sku);
        if (model != null) product.setModel(model);
        if (specifications != null) product.setSpecifications(specifications);
        if (warranty != null) product.setWarranty(warranty);
        if (condition != null) product.setCondition(condition);
        
        // Update Pricing
        if (originalPrice != null && !originalPrice.isEmpty()) {
            product.setOriginalPrice(new BigDecimal(originalPrice));
        }
        if (discountPercentage != null) {
            product.setDiscountPercentage(discountPercentage);
        }
        
        // Auto-calculate discounted price if both original price and discount are provided
        if (product.getOriginalPrice() != null && product.getDiscountPercentage() != null && product.getDiscountPercentage() > 0) {
            BigDecimal discount = product.getOriginalPrice()
                    .multiply(new BigDecimal(product.getDiscountPercentage()))
                    .divide(new BigDecimal(100), 2, BigDecimal.ROUND_HALF_UP);
            BigDecimal discountedPrice = product.getOriginalPrice().subtract(discount);
            product.setPrice(discountedPrice);
        } else if (price != null && !price.isEmpty()) {
            // Only update price manually if no discount calculation is needed
            product.setPrice(new BigDecimal(price));
        }
        
        if (shippingCost != null && !shippingCost.isEmpty()) {
            product.setShippingCost(new BigDecimal(shippingCost));
        }
        if (freeShipping != null) {
            product.setFreeShipping(freeShipping);
        }
        
        // Update Product Details
        if (color != null) product.setColor(color);
        if (size != null) product.setSize(size);
        if (weight != null && !weight.isEmpty()) {
            product.setWeight(new BigDecimal(weight));
        }
        if (dimensions != null) product.setDimensions(dimensions);
        
        // Update Seller & Origin
        if (seller != null) product.setSeller(seller);
        if (origin != null) product.setOrigin(origin);
        if (manufacturer != null) product.setManufacturer(manufacturer);
        
        // Update Rating & Reviews
        if (rating != null && !rating.isEmpty()) {
            product.setRating(new BigDecimal(rating));
        }
        if (reviewCount != null) {
            product.setReviewCount(reviewCount);
        }
        
        // Update Stock Management
        if (minOrderQuantity != null) {
            product.setMinOrderQuantity(minOrderQuantity);
        }
        if (maxOrderQuantity != null) {
            product.setMaxOrderQuantity(maxOrderQuantity);
        }
        if (stockQuantity != null) {
            product.setInStock(stockQuantity > 0);
        }
        if (featured != null) {
            product.setFeatured(featured);
        }
        if (bestSeller != null) {
            product.setBestSeller(bestSeller);
        }
        
        // Update Tags & Keywords
        if (tags != null) product.setTags(tags);
        if (keywords != null) product.setKeywords(keywords);
        if (status != null) product.setStatus(status);

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

        // Update timestamp
        product.setUpdatedAt(new Date());

        return productRepository.save(product);
    }

}
