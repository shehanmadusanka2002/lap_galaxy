package com.example.productmanagement.controller;

import com.example.productmanagement.config.JwtUtil;
import com.example.productmanagement.dto.LoginRequest;
import com.example.productmanagement.model.User;
import com.example.productmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173,http://localhost:5174")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOptional = userService.findByUsername(loginRequest.getUsername());
            
            if (userOptional.isEmpty()) {
                throw new BadCredentialsException("Invalid username or password");
            }

            User user = userOptional.get();
            
            // Check if user account is active
            if (user.getActive() == null || !user.getActive()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Your account has been deactivated. Please contact the administrator.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
            }
            
            if (!userService.validatePassword(loginRequest.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("Invalid username or password");
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());
            response.put("message", "Login successful!");

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
