package com.example.comparateur.DTO;


public class PhotoResponseDTO {
    private Long id;
    private String name;
    private String type;
    private String data; // Base64-encoded data

    public PhotoResponseDTO(Long id, String name, String type, String data) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.data = data;
    }

    // Getters and Setters
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
