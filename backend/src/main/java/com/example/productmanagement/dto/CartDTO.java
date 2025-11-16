package com.example.productmanagement.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartDTO {
    
    private Long id;
    private Long userId;
    private String sessionId;
    private List<CartItemDTO> items = new ArrayList<>();
    private BigDecimal totalAmount;
    private Integer totalItems;
    private BigDecimal shippingCost;
    private BigDecimal grandTotal;
}
