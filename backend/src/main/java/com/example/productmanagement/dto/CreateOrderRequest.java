package com.example.productmanagement.dto;

import com.example.productmanagement.model.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {
    private List<OrderItemRequest> items;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal totalAmount;
    private Order.PaymentMethod paymentMethod;
    private ShippingInfo shippingInfo;
    private String notes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        private Long cartItemId;
        private Long productId;
        private Integer quantity;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShippingInfo {
        private String fullName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String postalCode;
        private String country;
    }
}
