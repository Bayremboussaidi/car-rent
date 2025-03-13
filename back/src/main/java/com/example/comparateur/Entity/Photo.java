/*package com.example.comparateur.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "photo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    private String url;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voiture_id", nullable = false)
    @JsonIgnore
    private Voiture voiture;

    // Helper method to generate URL (uncomment if needed)
    public String getDisplayUrl() {
        if (url != null && !url.isEmpty()) {
            return url;
        } else if (data != null) {
            // return Base64.getEncoder().encodeToString(data);
        }
        return "/images/default-photo.png";
    }
}*/





package com.example.comparateur.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "photo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore // ✅ Prevents exposing byte[] directly in JSON responses
    private byte[] data;  // ✅ Store image in `byte[]` format

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voiture_id", nullable = false)
    @JsonIgnore // ✅ Avoids infinite recursion when returning JSON
    private Voiture voiture;

    // ✅ Constructor to initialize a Photo with name, type, and data
    public Photo(String name, String type, byte[] data, Voiture voiture) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.voiture = voiture;
    }
}
