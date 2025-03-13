/*package com.example.comparateur.DTO;

public class PhotoResponseDTO {
    private Long id;
    private String name;
    private String type;
    private String data; // Base64-encoded data

    // ✅ Constructor to initialize all fields
    public PhotoResponseDTO(Long id, String name, String type, String data) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.data = data;
    }

    // ✅ Constructor to initialize only name
    public PhotoResponseDTO(String name) {
        this.name = name;
    }

    // ✅ Constructor to handle URL-based photo response
    public PhotoResponseDTO(Long id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
*/



package com.example.comparateur.DTO;

import java.util.Base64;

import com.example.comparateur.Entity.Photo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PhotoResponseDTO {
    private String name;
    private String type;
    private String data;  // ✅ Store Base64 encoded image

    public PhotoResponseDTO(Photo photo) {
        this.name = photo.getName();
        this.type = photo.getType();

        // ✅ Convert byte[] to Base64
        if (photo.getData() != null) {
            this.data = Base64.getEncoder().encodeToString(photo.getData());
        } else {
            this.data = null;
        }
    }
}
