package com.example.comparateur.DTO;

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
