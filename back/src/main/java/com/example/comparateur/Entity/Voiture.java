package com.example.comparateur.Entity;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
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

    @Lob
    private String imgUrl; // Base64 encoded image string

    private boolean disponible; // Availability property

    private Date createdAt;
    private Date updatedAt;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "voiture", orphanRemoval = true)
    @JsonManagedReference
    private List<Review> reviews;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "voiture", orphanRemoval = true)
    @JsonManagedReference
    private List<Photo> photos;

    @OneToMany(mappedBy = "voiture", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Booking> bookings;

    // Automatically manage createdAt & updatedAt
    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }

    // Update availability based on bookings
    public void updateDisponibilite() {
        Date now = new Date();
        boolean isBooked = bookings != null && bookings.stream()
                .anyMatch(booking -> now.after(booking.getStartDate()) && now.before(booking.getEndDate()));
        this.disponible = !isBooked;
    }

    // Dynamically return imgUrl as Base64
    public String getImgUrl() {
        if (photos != null && !photos.isEmpty()) {
            Photo firstPhoto = photos.get(0);
            if (firstPhoto.getData() != null) {
                return "data:image/png;base64," + java.util.Base64.getEncoder().encodeToString(firstPhoto.getData());
            }
        }
        return null;
    }
}
