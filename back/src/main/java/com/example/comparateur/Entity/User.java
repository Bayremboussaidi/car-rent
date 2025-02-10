package com.example.comparateur.Entity;


import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Change type to Long for JPA compatibility

    private String username;
    private String email;
    private String password;
    private String photo;
    @Enumerated(EnumType.STRING)
    private Role role;
    private int phone;
    
    @Column(nullable = true, length = 255)
    private String workplace;

    private Date createdAt;
    private Date updatedAt;
}