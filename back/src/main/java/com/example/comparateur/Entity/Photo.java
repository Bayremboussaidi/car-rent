
/*package com.example.comparateur.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
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

    private String name;
    private String type;
    private String url; // ✅ New field for image URL

    @Lob
    @JsonIgnore // ✅ Exclude image data from JSON responses to reduce payload size
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "voiture_id")
    @JsonIgnore // ✅ Prevent infinite recursion
    private Voiture voiture;

    public String getDisplayUrl() {
        if (url != null && !url.isEmpty()) {
            return url; // ✅ If URL exists, return it
        } else if (data != null) {
            return "data:image/png;base64," + java.util.Base64.getEncoder().encodeToString(data);
        }
        return "/images/default-photo.png"; // ✅ Default image if no data or URL
    }
}
    */



    package com.example.comparateur.Entity;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;
    import java.util.UUID;
    
    @Entity
    @Table(name = "photo", schema = "public") // ✅ PostgreSQL Schema
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public class Photo {
    
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO) // ✅ PostgreSQL UUID for unique IDs
        private UUID id;
    
        private String name;
        private String type;
        private String url;
    
        @Lob
        @Column(columnDefinition = "BYTEA") // ✅ Binary image data for PostgreSQL
        @JsonIgnore
        private byte[] data;
    
        @Column(name = "voiture_id", nullable = false) // ✅ No FK constraint, manual validation required
        private Long voitureId; // ✅ Stores reference to MySQL `voiture.id`
    }
    