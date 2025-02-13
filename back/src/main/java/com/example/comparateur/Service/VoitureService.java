package com.example.comparateur.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.comparateur.DTO.ApiResponse;
import com.example.comparateur.Entity.Booking;
import com.example.comparateur.Entity.Photo;
import com.example.comparateur.Entity.Review;
import com.example.comparateur.Entity.Voiture;
import com.example.comparateur.Repository.BookingRepository;
import com.example.comparateur.Repository.PhotoRepository;
import com.example.comparateur.Repository.ReviewRepository;
import com.example.comparateur.Repository.VoitureRepository;

@Service
public class VoitureService {

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    // ✅ Create a new Voiture
    public ResponseEntity<Object> createVoiture(Voiture voiture) {
        try {
            Voiture savedVoiture = voitureRepository.save(voiture);
            updateDisponibilite(savedVoiture.getId());
            return ResponseEntity.ok().body(new ApiResponse<>(true, "Successfully created", savedVoiture));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to create. Try again"));
        }
    }

    // ✅ Update Voiture with or without a new image
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
            existingVoiture.setUpdatedAt(LocalDateTime.now());

            if (file != null && !file.isEmpty()) {
                String fileName = file.getOriginalFilename();
                existingVoiture.setImgUrl("/uploads/" + fileName);
            }

            voitureRepository.save(existingVoiture);
            updateDisponibilite(id);
            return ResponseEntity.ok().body(new ApiResponse<>(true, "Successfully updated", existingVoiture));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Voiture not found"));
        }
    }

    // ✅ Delete a Voiture and all its related photos
    public ResponseEntity<Object> deleteVoiture(Long id) {
        try {
            photoRepository.deleteByVoitureId(id);
            voitureRepository.deleteById(id);
            return ResponseEntity.ok().body(new ApiResponse<>(true, "Successfully deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to delete"));
        }
    }

    // ✅ Get a single Voiture with Photos, Reviews & Bookings
    public ResponseEntity<Object> getOneVoiture(Long id) {
        Optional<Voiture> optionalVoiture = voitureRepository.findById(id);

        if (optionalVoiture.isPresent()) {
            Voiture voiture = optionalVoiture.get();

            // ✅ Fetch related photos
            List<Photo> photos = photoRepository.findAllByVoitureId(id);
            voiture.setPhotos(photos);

            // ✅ Fetch related reviews
            List<Review> reviews = reviewRepository.findAllByVoitureId(id);
            voiture.setReviews(reviews);

            // ✅ Fetch related bookings
            List<Booking> bookings = bookingRepository.findByVoitureId(id);
            voiture.setBookings(bookings);

            return ResponseEntity.ok().body(new ApiResponse<>(true, "Voiture info", voiture));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Not found"));
        }
    }

    // ✅ Get paginated list of Voitures
    public ResponseEntity<Object> getAllVoitures(int page) {
        Pageable pageable = PageRequest.of(page, 8);
        Page<Voiture> voiturePage = voitureRepository.findAll(pageable);

        voiturePage.getContent().forEach(voiture -> updateDisponibilite(voiture.getId()));

        return ResponseEntity.ok().body(new ApiResponse<>(true, "Successful", voiturePage.getContent()));
    }

    // ✅ Search Voiture by location
    public ResponseEntity<Object> getVoitureBySearch(String local) {
        List<Voiture> voitures = voitureRepository.findByLocalContainingIgnoreCase(local);
        return ResponseEntity.ok().body(new ApiResponse<>(true, "Successful", voitures));
    }

    // ✅ Get all featured Voitures
    public ResponseEntity<Object> getFeaturedVoitures() {
        List<Voiture> voitures = voitureRepository.findByFeatured(true);
        return ResponseEntity.ok().body(new ApiResponse<>(true, "Successful", voitures));
    }

    // ✅ Get the total count of Voitures
    public ResponseEntity<Object> getVoitureCount() {
        long voitureCount = voitureRepository.count();
        return ResponseEntity.ok().body(new ApiResponse<>(true, "Successful", voitureCount));
    }

    // ✅ Upload multiple photos for a Voiture
    public ResponseEntity<Object> addPhotosToVoiture(Long voitureId, MultipartFile[] files) {
        try {
            Voiture voiture = voitureRepository.findById(voitureId)
                    .orElseThrow(() -> new RuntimeException("Voiture not found"));

            for (MultipartFile file : files) {
                Photo photo = new Photo();
                photo.setName(file.getOriginalFilename());
                photo.setType(file.getContentType());
                photo.setData(file.getBytes());
                photo.setVoiture(voiture);

                photoRepository.save(photo);
            }

            return ResponseEntity.ok().body(new ApiResponse<>(true, "Photos added successfully"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to add photos"));
        }
    }

    // ✅ Delete all photos of a Voiture
    public ResponseEntity<Object> deletePhotosByVoitureId(Long voitureId) {
        photoRepository.deleteByVoitureId(voitureId);
        return ResponseEntity.ok().body(new ApiResponse<>(true, "All photos deleted"));
    }

    // ✅ Fetch all photos of a Voiture
    public ResponseEntity<Object> getPhotosByVoitureId(Long id) {
        List<Photo> photos = photoRepository.findAllByVoitureId(id);
        if (photos.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "No photos found for this Voiture"));
        }
        return ResponseEntity.ok().body(new ApiResponse<>(true, "Photos retrieved successfully", photos));
    }

    // ✅ Update the availability of a Voiture
    public void updateDisponibilite(Long voitureId) {
        Voiture voiture = voitureRepository.findById(voitureId).orElse(null);
        if (voiture == null) return;

        LocalDate now = LocalDate.now();
        List<Booking> bookings = bookingRepository.findByVoitureId(voitureId);

        boolean isBooked = bookings.stream()
                .anyMatch(booking -> now.isAfter(booking.getStartDate()) && now.isBefore(booking.getEndDate()));

        voiture.setDisponible(!isBooked);
        voitureRepository.save(voiture);
    }

    // ✅ Automatically check availability every minute
    @Scheduled(fixedRate = 60000)
    public void checkDisponibiliteForAllCars() {
        List<Voiture> voitures = voitureRepository.findAll();
        voitures.forEach(voiture -> updateDisponibilite(voiture.getId()));
    }
}
