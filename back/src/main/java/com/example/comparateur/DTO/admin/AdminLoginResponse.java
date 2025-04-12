package com.example.comparateur.DTO.admin;

import java.util.List;

public class AdminLoginResponse {

    private String message;
    private String username;
    private String email;
    private Long phone;
    private String workplace;
    private List<String> roles; // Keeps the roles list (optional if you still need it)
    private String role; // New field to store a single role as a string

    public AdminLoginResponse() {
        // Default constructor
    }

    public AdminLoginResponse(String message, String username, String email, Long phone, String workplace, List<String> roles) {
        this.message = message;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.workplace = workplace;
        this.roles = roles;
        this.role = roles.isEmpty() ? "" : roles.get(0); // Set the first role as a single role (if available)
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getPhone() {
        return phone;
    }

    public void setPhone(Long phone) {
        this.phone = phone;
    }

    public String getWorkplace() {
        return workplace;
    }

    public void setWorkplace(String workplace) {
        this.workplace = workplace;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
        this.role = roles.isEmpty() ? "" : roles.get(0); // Set role based on the list
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
