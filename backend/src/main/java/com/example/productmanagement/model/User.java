package com.example.productmanagement.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "username"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; // Default role is USER

    @Column(nullable = false)
    private Boolean active = true; // Default is active, admin can deactivate

    // Custom setter to ensure ADMIN accounts are always active
    public void setActive(Boolean active) {
        if (this.role == Role.ADMIN) {
            this.active = true; // Admin accounts are ALWAYS active
        } else {
            this.active = active;
        }
    }

    // Override setRole to ensure when setting role to ADMIN, active is set to true
    public void setRole(Role role) {
        this.role = role;
        if (role == Role.ADMIN) {
            this.active = true; // Admin accounts must be active
        }
    }
}

