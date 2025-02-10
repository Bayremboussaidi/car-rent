package com.example.comparateur.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.comparateur.DTO.ApiResponse;
import com.example.comparateur.Entity.Photo;
import com.example.comparateur.Entity.Voiture;
import com.example.comparateur.Entity.Booking;
import com.example.comparateur.Repository.PhotoRepository;
import com.example.comparateur.Repository.VoitureRepository;
import com.example.comparateur.Repository.BookingRepository;

@Service
public class VoitureService {

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private PhotoRepository photoRepository;
    
    @Autowired
    private BookingRepository bookingRepository;

    public ResponseEntity<Object> createVoiture(Voiture voiture) {
        try {
            Voiture savedVoiture = voitureRepository.save(voiture);
            updateDisponibilite(savedVoiture.getId());
            return ResponseEntity.ok().body(new ApiResponse<>(true, "Successfully created", savedVoiture));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to create. Try again"));
        }
    }

    public ResponseEntity<Object> updateVoiture(Long id, Voiture voiture, MultipartFile file) {
        Optional<Voiture> optionalVoiture = voitureRepository.findById(id);
    
        if (optionalVoiture.isPresent()) {
            Voiture existingVoiture = optionalVoiture.get();
            existingVoiture.setCarName(voiture.getCarName());
            existingVoiture.setBrand(voiture.getBrand());
            existingVoiture.setCategory(voiture.getCategory());
            existingVoiture.setTransmission(voiture.getTransmission());
            existingVoiture.setToit(voiture.getToit());
            existingVoiture.setCarburant(voiture.getCarburant());
            existingVoiture.setPrice(voiture.getPrice());
            existingVoiture.setFeatured(voiture.isFeatured());
            existingVoiture.setAgence(voiture.getAgence());
            existingVoiture.setLocal(voiture.getLocal());
            existingVoiture.setAgenceLogo(voiture.getAgenceLogo());
            existingVoiture.setDescription(voiture.getDescription());
            existingVoiture.setUpdatedAt(new Date());
    
            if (file != null && !file.isEmpty()) {
                String fileName = file.getOriginalFilename();
                existingVoiture.setImgUrl("/uploads/" + fileName);
            }
    
            voitureRepository.save(existingVoiture);
            updateDisponibilite(id);
            return ResponseEntity.ok().body(new ApiResponse<>(true, "Successfully updated"));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Voiture not found"));
        }
    }
    
    public ResponseEntity<Object> deleteVoiture(Long id) {
        try {
            voitureRepository.deleteById(id);
            return ResponseEntity.ok().body(new ApiResponse<>(true, "Successfully deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to delete"));
        }
    }

    public ResponseEntity<Object> getOneVoiture(Long id) {
        Optional<Voiture> optionalVoiture = voitureRepository.findById(id);
        if (optionalVoiture.isPresent()) {
            Voiture voiture = optionalVoiture.get();
            updateDisponibilite(id);
            return ResponseEntity.ok().body(new ApiResponse<>(true, "Voiture info", voiture));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Not found"));
        }
    }

    public ResponseEntity<Object> getAllVoitures(int page) {
        List<Voiture> voitures = voitureRepository.findAll()
                .stream()
                .skip(page * 8)
                .limit(8)
                .toList();

        voitures.forEach(voiture -> updateDisponibilite(voiture.getId()));
        return ResponseEntity.ok().body(new ApiResponse<>(true, "Successful", voitures));
    }

    public ResponseEntity<Object> getVoitureBySearch(String local) {
        List<Voiture> voitures = voitureRepository.findByLocalContainingIgnoreCase(local);
        return ResponseEntity.ok().body(new ApiResponse<>(true, "Successful", voitures));
    }

    public ResponseEntity<Object> getFeaturedVoitures() {
        List<Voiture> voitures = voitureRepository.findByFeatured(true);
        return ResponseEntity.ok().body(new ApiResponse<>(true, "Successful", voitures));
    }

    public ResponseEntity<Object> getVoitureCount() {
        long voitureCount = voitureRepository.count();
        return ResponseEntity.ok().body(new ApiResponse<>(true, "Successful", voitureCount));
    }

    public ResponseEntity<Object> addPhotoToVoiture(Long voitureId, MultipartFile file) {
        try {
            Voiture voiture = voitureRepository.findById(voitureId)
                    .orElseThrow(() -> new RuntimeException("Voiture not found"));

            Photo photo = new Photo();
            photo.setName(file.getOriginalFilename());
            photo.setType(file.getContentType());
            photo.setData(file.getBytes());
            photo.setVoiture(voiture);

            Photo savedPhoto = photoRepository.save(photo);
            return ResponseEntity.ok().body(new ApiResponse<>(true, "Photo added successfully", savedPhoto));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to add photo"));
        }
    }

    public void updateDisponibilite(Long voitureId) {
        Voiture voiture = voitureRepository.findById(voitureId).orElse(null);
        if (voiture == null) return;

        Date now = new Date();
        List<Booking> bookings = bookingRepository.findByVoitureId(voitureId);

        boolean isBooked = bookings.stream()
                .anyMatch(booking -> now.after(booking.getStartDate()) && now.before(booking.getEndDate()));

        voiture.setDisponible(!isBooked);
        voitureRepository.save(voiture);
    }

    @Scheduled(fixedRate = 60000)
    public void checkDisponibiliteForAllCars() {
        List<Voiture> voitures = voitureRepository.findAll();
        voitures.forEach(voiture -> updateDisponibilite(voiture.getId()));
    }
}
