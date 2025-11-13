package com.example.productmanagement.controller;

import com.example.productmanagement.dto.UserDTO;
import com.example.productmanagement.model.Role;
import com.example.productmanagement.model.User;
import com.example.productmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173,http://localhost:5174")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        try {
            // Default role is USER, only admins can create admin users through different endpoint
            Role role = userDTO.getRole() != null ? userDTO.getRole() : Role.USER;
            userService.registerUser(userDTO.getUsername(), userDTO.getEmail(), userDTO.getPassword(), role);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            // Prevent deleting admin users
            User user = userService.getUserById(id);
            
            if (user.getRole() == Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Cannot delete admin users");
            }
            
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/toggle-active/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserActiveStatus(@PathVariable Long id) {
        try {
            User updatedUser = userService.toggleUserActiveStatus(id);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
