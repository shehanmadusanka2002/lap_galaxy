package com.example.productmanagement.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartItemDTO {
    
    private Long id;
    private Long cartId;
    private Integer productId;
    private String productName;
    private String productBrand;
    private String productImageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subtotal;
    private Integer stockQuantity; // Available stock
    private Boolean inStock;
    private BigDecimal shippingCost; // Product's shipping cost
    private Boolean freeShipping; // Whether product has free shipping
}
