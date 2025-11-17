package com.example.productmanagement.controller;

import com.example.productmanagement.dto.CreateOrderRequest;
import com.example.productmanagement.dto.OrderDTO;
import com.example.productmanagement.model.Order;
import com.example.productmanagement.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody CreateOrderRequest orderRequest) {
        try {
            OrderDTO order = orderService.createOrder(orderRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getAllOrders(
            @RequestParam(required = false) String status) {
        try {
            if (status != null && !status.isEmpty()) {
                Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
                return ResponseEntity.ok(orderService.getOrdersByStatus(orderStatus));
            }
            return ResponseEntity.ok(orderService.getAllOrders());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        try {
            OrderDTO order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderDTO> getOrderByNumber(@PathVariable String orderNumber) {
        try {
            OrderDTO order = orderService.getOrderByNumber(orderNumber);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getUserOrders() {
        return ResponseEntity.ok(orderService.getUserOrders());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Order.OrderStatus newStatus = Order.OrderStatus.valueOf(
                    statusUpdate.get("status").toUpperCase());
            OrderDTO updatedOrder = orderService.updateOrderStatus(id, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/notes")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> addOrderNotes(
            @PathVariable Long id,
            @RequestBody Map<String, String> notesUpdate) {
        try {
            OrderDTO updatedOrder = orderService.addOrderNotes(id, notesUpdate.get("notes"));
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
