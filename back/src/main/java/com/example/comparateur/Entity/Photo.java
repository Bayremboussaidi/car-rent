package com.example.comparateur.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "photo", schema = "public") // ✅ PostgreSQL Schema
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // ✅ UUID for unique IDs in PostgreSQL
    private UUID id;

    @Column(nullable = false)
    private String name; // ✅ Ensure getter/setter exists

    @Column(nullable = false)
    private String type; // ✅ Ensure getter/setter exists

    private String url;  // ✅ Optional field for storing external image URLs

    @Lob
    @Column(columnDefinition = "BYTEA") // ✅ Proper PostgreSQL Binary Storage
    @JsonIgnore
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "voiture_id", nullable = false) // ✅ Correct foreign key mapping
    @JsonIgnore
    private Voiture voiture;

    // ✅ Return base64 if no URL exists
    public String getDisplayUrl() {
        if (url != null && !url.isEmpty()) {
            return url;
        } else if (data != null) {
            return "data:image/png;base64," + java.util.Base64.getEncoder().encodeToString(data);
        }
        return "/images/default-photo.png"; // ✅ Default fallback image
    }

    // ✅ Method to set `voiture` from a `voitureId`
    public void setVoitureId(Long voitureId) {
        this.voiture = new Voiture();  // Create a new Voiture instance
        this.voiture.setId(voitureId); // Set the ID
    }
}
