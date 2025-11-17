package com.example.productmanagement.dto;

import com.example.productmanagement.model.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userName;
    private String userEmail;
    private List<OrderItemDTO> items;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private Order.PaymentMethod paymentMethod;
    private String shippingFullName;
    private String shippingEmail;
    private String shippingPhone;
    private String shippingAddress;
    private String shippingCity;
    private String shippingPostalCode;
    private String shippingCountry;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private String notes;
}
