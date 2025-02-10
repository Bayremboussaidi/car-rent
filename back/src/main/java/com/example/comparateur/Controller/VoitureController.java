package com.example.comparateur.Controller;

import com.example.comparateur.Entity.Voiture;
import com.example.comparateur.Service.VoitureService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/voitures")
@CrossOrigin(origins = "http://localhost:4200")
public class VoitureController {

    @Autowired
    private VoitureService voitureService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> createVoiture(@RequestBody Voiture voiture) {
        return voitureService.createVoiture(voiture);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> updateVoiture(
            @PathVariable Long id,
            @RequestPart("voiture") Voiture voiture,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return voitureService.updateVoiture(id, voiture, file);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteVoiture(@PathVariable Long id) {
        return voitureService.deleteVoiture(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOneVoiture(@PathVariable Long id) {
        return voitureService.getOneVoiture(id);
    }

    @GetMapping
    public ResponseEntity<Object> getAllVoitures(@RequestParam(defaultValue = "0") int page) {
        return voitureService.getAllVoitures(page);
    }

    @GetMapping("/search/getVoitureBySearch")
    public ResponseEntity<Object> getVoitureBySearch(@RequestParam String local) {
        return voitureService.getVoitureBySearch(local);
    }

    @GetMapping("/search/getFeaturedVoitures")
    public ResponseEntity<Object> getFeaturedVoitures() {
        return voitureService.getFeaturedVoitures();
    }

    @GetMapping("/search/getVoitureCount")
    public ResponseEntity<Object> getVoitureCount() {
        return voitureService.getVoitureCount();
    }

    @PostMapping(value = "/{id}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> uploadPhotoForVoiture(
        @PathVariable Long id,
        @RequestParam("file") MultipartFile file) {
        System.out.println("Received request to upload photo for Voiture ID: " + id);
        return voitureService.addPhotoToVoiture(id, file);
    }


}
