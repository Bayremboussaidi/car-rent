
/*  package com.example.comparateur.Entity;

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
        @OneToMany(mappedBy = "voiture", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
        @JsonManagedReference
        private List<Review> reviews;
    
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
    
        public void updateDisponibilite() {
            LocalDate now = LocalDate.now();
            if (bookings != null && !bookings.isEmpty()) {
                boolean isBooked = bookings.stream()
                    .anyMatch(booking -> now.isAfter(booking.getStartDate()) && now.isBefore(booking.getEndDate()));
                this.disponible = !isBooked;
            } else {
                this.disponible = true;
            }
        }
    }
    */




    package com.example.comparateur.Entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

    @Column(nullable = false)
    private String carName;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String transmission;

    @Column(nullable = false)
    private String toit;

    @Column(nullable = false)
    private String carburant;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private boolean featured;

    @Column(nullable = false)
    private String agence;

    @Column(nullable = false)
    private String local;

    @Column(nullable = false)
    private String agenceLogo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private String imgUrl;

    @Column(nullable = false)
    private boolean disponible;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void updateDisponibilite() {
        LocalDate now = LocalDate.now();
        this.disponible = true; // Default to available
    }
}
