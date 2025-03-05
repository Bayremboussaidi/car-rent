
package com.example.comparateur.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
@Table(name = "voiture")
public class Voiture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String carName;
    private String brand;
    private String category;
    private String transmission;
    private String toit;
    private String carburant;
    private int price;
    private boolean featured;
    private String agence;
    private String local;
    private String agenceLogo;
    private String description;

    private String imgUrl;

    private boolean disponible;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ Fetch reviews associated with this voiture
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "voiture", orphanRemoval = true)
    @JsonManagedReference
    private List<Review> reviews;

    // ❌ REMOVED PHOTOS MAPPING (Since Photos are in PostgreSQL)
    // @OneToMany(mappedBy = "voiture", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    // @JsonManagedReference
    // private List<Photo> photos;

    // ✅ Fetch bookings associated with this voiture
    @OneToMany(mappedBy = "voiture", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<Booking> bookings;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ✅ Update availability based on current bookings
    public void updateDisponibilite() {
        LocalDate now = LocalDate.now();
        if (bookings != null && !bookings.isEmpty()) {
            boolean isBooked = bookings.stream()
                .anyMatch(booking -> now.isAfter(booking.getStartDate()) && now.isBefore(booking.getEndDate()));
            this.disponible = !isBooked;
        } else {
            this.disponible = true; // ✅ Default to available if no bookings exist
        }
    }
}
