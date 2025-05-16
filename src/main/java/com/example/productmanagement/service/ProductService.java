package com.example.productmanagement.service;

import com.example.productmanagement.exception.ResourceNotFoundException;
import com.example.productmanagement.model.Product;
import com.example.productmanagement.dto.ProductDTO;
import com.example.productmanagement.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

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
        product.setImageName(productDetails.getImageName());
        product.setImageType(productDetails.getImageType());
        product.setImageData(productDetails.getImageData());

        return productRepository.save(product);
    }

    public void deleteProduct(Integer id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    public Product updateProductImage(Integer id, String imageName, String imageType, byte[] imageData) {
        Product product = getProductById(id);

        product.setImageName(imageName);
        product.setImageType(imageType);
        product.setImageData(imageData);

        return productRepository.save(product);
    }

    public Product createProductWithImage(
            String name, String description, String brand, String price,
            String category, String releaseDateStr, boolean productAvailable,
            int stockQuantity, MultipartFile imageFile) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setBrand(brand);
        product.setPrice(new BigDecimal(price));
        product.setCategory(category);
        product.setProductAvailable(productAvailable);
        product.setStockQuantity(stockQuantity);

        // Parse date if provided
        if (releaseDateStr != null && !releaseDateStr.isEmpty()) {
            try {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date releaseDate = dateFormat.parse(releaseDateStr);
                product.setReleaseDate(releaseDate);
            } catch (ParseException e) {
                throw new IllegalArgumentException("Invalid date format. Use yyyy-MM-dd");
            }
        }

        // Add image if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageData(imageFile.getBytes());
        }

        return productRepository.save(product);
    }

    public List<ProductDTO> getAllProductsWithImage() {
        List<Product> products = productRepository.findAll();
        List<ProductDTO> dtos = new ArrayList<>();

        for (Product product : products) {
            ProductDTO dto = new ProductDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setDescription(product.getDescription());
            dto.setBrand(product.getBrand());
            dto.setPrice(product.getPrice());
            dto.setCategory(product.getCategory());
            dto.setReleaseDate(product.getReleaseDate());
            dto.setProductAvailable(product.isProductAvailable());
            dto.setStockQuantity(product.getStockQuantity());
            dto.setImageName(product.getImageName());


            if (product.getImageData() != null) {
                String base64Image = Base64.getEncoder().encodeToString(product.getImageData());
                dto.setImageBase64(base64Image);
            }

            dtos.add(dto);
        }

        return dtos;
    }

    public Product findById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }


}
