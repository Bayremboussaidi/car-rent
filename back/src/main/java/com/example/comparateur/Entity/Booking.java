package com.example.comparateur.Entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "booking")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "User ID is mandatory")
    @Column(nullable = false)
    private Long userId;

    @NotBlank(message = "Username is mandatory")
    @Column(nullable = false)
    private String username;

    @NotBlank(message = "Car name is mandatory")
    @Column(nullable = false)
    private String carName;

    @Email(message = "Invalid email format")
    @Column(nullable = false)
    private String userEmail;

    @Positive(message = "Days count must be positive")
    @Column(nullable = false)
    private int nbrJrs;

    @Pattern(regexp = "^\\+?[0-9\\s-]{8,15}$", message = "Invalid phone number")
    @Column(nullable = false)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String description;

    @FutureOrPresent(message = "Start date must be in the future or present")
    @Column(nullable = false)
    private LocalDate startDate;

    @Future(message = "End date must be in the future")
    @Column(nullable = false)
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voiture_id", nullable = false)
    private Voiture voiture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus bookingStatus = BookingStatus.PENDING;

    @NotBlank(message = "Pickup location is mandatory")
    @Column(nullable = false)
    private String pickupLocation;

    @NotBlank(message = "Dropoff location is mandatory")
    @Column(nullable = false)
    private String dropoffLocation;
}