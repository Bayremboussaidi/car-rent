package com.example.comparateur.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;
    

    @Column(nullable = false)
    private Long userId; // ✅ Changed to Long

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String carName;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private int nbrJrs;

    @Column(nullable = false)
    private String phone; // ✅ Changed to String

    @Column(columnDefinition = "TEXT")
    private String description;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date endDate;

    @ManyToOne
    @JoinColumn(name = "voiture_id", nullable = false)
    private Voiture voiture;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    // ✅ Added default pickup and dropoff locations
    @Column(nullable = false)
    private String pickupLocation = "Lac2";

    @Column(nullable = false)
    private String dropoffLocation = "Lac2";
}
