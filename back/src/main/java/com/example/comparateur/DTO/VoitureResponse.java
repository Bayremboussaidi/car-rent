/*package com.example.comparateur.DTO;

import com.example.comparateur.Entity.Booking;
import com.example.comparateur.Entity.Photo;
import com.example.comparateur.Entity.Review;
import com.example.comparateur.Entity.Voiture;

import java.util.List;

public class VoitureResponse {
    private Voiture voiture;
    private List<Photo> photos;
    private List<Review> reviews;
    private List<Booking> bookings;

    // ✅ Constructor accepting all four parameters
    public VoitureResponse(Voiture voiture, List<Photo> photos, List<Review> reviews, List<Booking> bookings) {
        this.voiture = voiture;
        this.photos = photos;
        this.reviews = reviews;
        this.bookings = bookings;
    }

    // ✅ Constructor for backward compatibility
    public VoitureResponse(Voiture voiture, List<Photo> photos) {
        this.voiture = voiture;
        this.photos = photos;
    }

    // ✅ Getters and Setters
    public Voiture getVoiture() {
        return voiture;
    }

    public void setVoiture(Voiture voiture) {
        this.voiture = voiture;
    }

    public List<Photo> getPhotos() {
        return photos;
    }

    public void setPhotos(List<Photo> photos) {
        this.photos = photos;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
}
*/


package com.example.comparateur.DTO;

import java.util.List;

import com.example.comparateur.Entity.Review;
import com.example.comparateur.Entity.Voiture;

public class VoitureResponse {
    private Long id;
    private String carName;
    private String brand;
    private String category;
    private String transmission;
    private String toit;
    private String carburant;
    private double price;
    private boolean featured;
    private String agence;
    private String local;
    private String agenceLogo;
    private String description;
    private boolean disponible;
    private String createdAt;
    private String updatedAt;
    private List<PhotoResponseDTO> images;  // ✅ Car Images
    private List<Review> reviews; // ✅ Car Reviews (Type-Safe)

    public VoitureResponse(Voiture voiture, List<PhotoResponseDTO> images, List<Review> reviews) {
        this.id = voiture.getId();
        this.carName = voiture.getCarName();
        this.brand = voiture.getBrand();
        this.category = voiture.getCategory();
        this.transmission = voiture.getTransmission();
        this.toit = voiture.getToit();
        this.carburant = voiture.getCarburant();
        this.price = voiture.getPrice();
        this.featured = voiture.isFeatured();
        this.agence = voiture.getAgence();
        this.local = voiture.getLocal();
        this.agenceLogo = voiture.getAgenceLogo();
        this.description = voiture.getDescription();
        this.disponible = voiture.isDisponible();
        this.createdAt = voiture.getCreatedAt() != null ? voiture.getCreatedAt().toString() : null;
        this.updatedAt = voiture.getUpdatedAt() != null ? voiture.getUpdatedAt().toString() : null;
        this.images = images != null ? images : List.of(); // Avoid null lists
        this.reviews = reviews != null ? reviews : List.of(); // Avoid null lists
    }

    // ✅ Getters & Setters
}
