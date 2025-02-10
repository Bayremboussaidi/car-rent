package com.example.comparateur.Controller;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.comparateur.DTO.PhotoResponseDTO;
import com.example.comparateur.Entity.Photo;
import com.example.comparateur.Service.PhotoService;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "http://localhost:4200")
public class PhotoController {

    @Autowired
    private PhotoService photoService;

    // Endpoint to upload a photo linked to a voiture
    @PostMapping("/upload/{voitureId}")
    public ResponseEntity<Photo> uploadPhoto(@PathVariable Long voitureId, @RequestParam("file") MultipartFile file) throws IOException {
        Photo photo = photoService.savePhoto(voitureId, file);
        return ResponseEntity.ok(photo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Photo> getPhotoById(@PathVariable Long id) {
        Photo photo = photoService.getPhotoById(id);
        System.out.println("Photo Retrieved: " + photo);
        return ResponseEntity.ok(photo);
    }

    @GetMapping("/{id}/data")
    public ResponseEntity<byte[]> getPhotoData(@PathVariable Long id) {
        Photo photo = photoService.getPhotoById(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(photo.getType()))
                .body(photo.getData());
    }

    @GetMapping("/voiture/{voitureId}")
    public ResponseEntity<PhotoResponseDTO> getPhotoByVoitureId(@PathVariable Long voitureId) {
        Photo photo = photoService.getPhotoByVoitureId(voitureId);
        if (photo == null) {
        return ResponseEntity.notFound().build();  }
                                                

    // Encode the photo data as Base64
    String base64Data = Base64.getEncoder().encodeToString(photo.getData());

    // Create a PhotoResponseDTO
    PhotoResponseDTO responseDTO = new PhotoResponseDTO(
            photo.getId(),
            photo.getName(),
            photo.getType(),
            "data:" + photo.getType() + ";base64," + base64Data
    );

    return ResponseEntity.ok(responseDTO);
    }


    // Endpoint to delete a photo by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePhotoById(@PathVariable Long id) {
        photoService.deletePhotoById(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint to update a photo
    @PutMapping("/{id}")
    public ResponseEntity<Photo> updatePhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        Photo updatedPhoto = photoService.updatePhoto(id, file);
        return ResponseEntity.ok(updatedPhoto);
    }
}
