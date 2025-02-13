package com.example.comparateur.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.comparateur.Entity.Voiture;
import com.example.comparateur.Service.VoitureService;

@RestController
@RequestMapping("/api/voitures")
@CrossOrigin(origins = "http://localhost:4200")
public class VoitureController {

    @Autowired
    private VoitureService voitureService;

    // ✅ Create a new Voiture
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> createVoiture(@RequestBody Voiture voiture) {
        return voitureService.createVoiture(voiture);
    }

    // ✅ Update Voiture with or without a new main image
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateVoiture(
            @PathVariable Long id,
            @RequestPart("voiture") Voiture voiture,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return voitureService.updateVoiture(id, voiture, file);
    }

    // ✅ Delete a Voiture (deletes linked photos automatically)
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteVoiture(@PathVariable Long id) {
        return voitureService.deleteVoiture(id);
    }

    // ✅ Get a single Voiture
    @GetMapping("/{id}")
    public ResponseEntity<Object> getOneVoiture(@PathVariable Long id) {
        return voitureService.getOneVoiture(id);
    }

    // ✅ Get all Voitures with pagination
    @GetMapping
    public ResponseEntity<Object> getAllVoitures(@RequestParam(defaultValue = "0") int page) {
        return voitureService.getAllVoitures(page);
    }

    // ✅ Search for Voitures by location
    @GetMapping("/search/getVoitureBySearch")
    public ResponseEntity<Object> getVoitureBySearch(@RequestParam String local) {
        return voitureService.getVoitureBySearch(local);
    }

    // ✅ Get all featured Voitures
    @GetMapping("/search/getFeaturedVoitures")
    public ResponseEntity<Object> getFeaturedVoitures() {
        return voitureService.getFeaturedVoitures();
    }

    // ✅ Get total count of Voitures
    @GetMapping("/search/getVoitureCount")
    public ResponseEntity<Object> getVoitureCount() {
        return voitureService.getVoitureCount();
    }

    // ✅ Upload **multiple** photos for a Voiture
    @PostMapping(value = "/{id}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadPhotosForVoiture(
        @PathVariable Long id,
        @RequestParam("files") MultipartFile[] files) {
        System.out.println("Received request to upload multiple photos for Voiture ID: " + id);
        return voitureService.addPhotosToVoiture(id, files);
    }

    // ✅ Get all photos for a specific Voiture
    @GetMapping("/{id}/photos")
    public ResponseEntity<Object> getPhotosForVoiture(@PathVariable Long id) {
        System.out.println("Fetching photos for Voiture ID: " + id);
        return voitureService.getPhotosByVoitureId(id);
    }

    // ✅ Delete all photos of a Voiture
    @DeleteMapping("/{id}/photos")
    public ResponseEntity<Object> deletePhotosForVoiture(@PathVariable Long id) {
        System.out.println("Deleting all photos for Voiture ID: " + id);
        return voitureService.deletePhotosByVoitureId(id);
    }
}
