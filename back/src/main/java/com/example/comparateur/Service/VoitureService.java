/*package com.example.comparateur.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.comparateur.DTO.ApiResponse;
import com.example.comparateur.DTO.VoitureResponse;
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


    public ResponseEntity<Object> createVoiture(Voiture voiture) {
    try {
        // Validate required fields first
        if (voiture.getCarName() == null || voiture.getBrand() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Missing required fields"));
        }

        // Set default values for new cars
        voiture.setCreatedAt(LocalDateTime.now());
        voiture.setDisponible(true); // New cars are available by default
        voiture.setFeatured(false); // Default not featured

        Voiture savedVoiture = voitureRepository.save(voiture);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successfully created", savedVoiture));
    } catch (DataIntegrityViolationException e) {
        return ResponseEntity.status(400).body(new ApiResponse<>(false, "Database constraint violation: " + e.getRootCause().getMessage()));
    } catch (Exception e) {
        //logger.error("Error creating voiture", e); 
        return ResponseEntity.status(500).body(new ApiResponse<>(false, "Creation failed: " + e.getMessage()));
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
            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully updated", existingVoiture));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Voiture not found"));
        }
    }

    // ✅ Delete a Voiture and all its related photos
    public ResponseEntity<Object> deleteVoiture(Long id) {
        try {
            photoRepository.deleteByVoitureId(id);
            voitureRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to delete"));
        }
    }

    // ✅ Get a single Voiture with Photos, Reviews & Bookings
    public ResponseEntity<Object> getOneVoiture(Long id) {
        Optional<Voiture> optionalVoiture = voitureRepository.findById(id);

        if (optionalVoiture.isPresent()) {
            Voiture voiture = optionalVoiture.get();
            List<Photo> photos = photoRepository.findAllByVoitureId(id);
            List<Review> reviews = reviewRepository.findAllByVoitureId(id);
            List<Booking> bookings = bookingRepository.findByVoitureId(id);

            return ResponseEntity.ok(new ApiResponse<>(true, "Voiture info", 
                new VoitureResponse(voiture, photos, reviews, bookings)
            ));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "Not found"));
        }
    }

    // ✅ Get paginated list of Voitures
    public ResponseEntity<Object> getAllVoitures(int page) {
        Pageable pageable = PageRequest.of(page, 8);
        Page<Voiture> voiturePage = voitureRepository.findAll(pageable);

        voiturePage.getContent().forEach(voiture -> updateDisponibilite(voiture.getId()));

        return ResponseEntity.ok(new ApiResponse<>(true, "Successful", voiturePage.getContent()));
    }

    // ✅ Get all Voitures with related details
    public ResponseEntity<Object> getAllVoituresWithDetails() {
        List<Voiture> voitures = voitureRepository.findAll();

        if (voitures.isEmpty()) {
            return ResponseEntity.status(404).body(new ApiResponse<>(false, "No voitures found"));
        }

        List<VoitureResponse> voitureResponses = voitures.stream().map(voiture -> {
            List<Photo> photos = photoRepository.findAllByVoitureId(voiture.getId());
            List<Review> reviews = reviewRepository.findAllByVoitureId(voiture.getId());
            List<Booking> bookings = bookingRepository.findByVoitureId(voiture.getId());

            return new VoitureResponse(voiture, photos, reviews, bookings);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(new ApiResponse<>(true, "List of voitures with details", voitureResponses));
    }

    // ✅ Get all featured Voitures
    public ResponseEntity<Object> getFeaturedVoitures() {
        List<Voiture> voitures = voitureRepository.findByFeatured(true);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successful", voitures));
    }

    // ✅ Get total count of Voitures
    public ResponseEntity<Object> getVoitureCount() {
        long voitureCount = voitureRepository.count();
        return ResponseEntity.ok(new ApiResponse<>(true, "Total number of voitures", voitureCount));
    }

    // ✅ Search for Voitures by location
    public ResponseEntity<Object> getVoitureBySearch(String local) {
        List<Voiture> voitures = voitureRepository.findByLocalContainingIgnoreCase(local);
        return ResponseEntity.ok(new ApiResponse<>(true, "Successful", voitures));
    }

    // ✅ Upload multiple photos for a Voiture
    public ResponseEntity<Object> addPhotosToVoiture(Long voitureId, MultipartFile[] files) {
        try {
            voitureRepository.findById(voitureId)
                    .orElseThrow(() -> new RuntimeException("Voiture not found"));

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    Photo photo = new Photo();
                    photo.setName(file.getOriginalFilename());
                    photo.setType(file.getContentType());
                    photo.setData(file.getBytes());
                    photo.setVoitureId(voitureId);
                    photoRepository.save(photo);
                }
            }

            return ResponseEntity.ok(new ApiResponse<>(true, "Photos added successfully"));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to add photos"));
        }
    }

    // ✅ Fetch all photos of a Voiture
    public ResponseEntity<Object> getPhotosByVoitureId(Long voitureId) {
        List<Photo> photos = photoRepository.findAllByVoitureId(voitureId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Photos retrieved successfully", photos));
    }

    // ✅ Delete all photos of a Voiture
    public ResponseEntity<Object> deletePhotosByVoitureId(Long voitureId) {
        try {
            photoRepository.deleteByVoitureId(voitureId);
            return ResponseEntity.ok(new ApiResponse<>(true, "All photos deleted"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to delete photos"));
        }
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
}


    // ✅ Create a new Voiture
    /* 
     *     public ResponseEntity<Object> createVoiture(Voiture voiture) {
        try {
            Voiture savedVoiture = voitureRepository.save(voiture);
            updateDisponibilite(savedVoiture.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully created", savedVoiture));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to create. Try again"));
        }
    }
    */


    package com.example.comparateur.Service;

    import java.time.LocalDateTime;
    import java.util.Collections;
    import java.util.List;
    import java.util.Optional;
    import java.util.stream.Collectors;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
    import org.springframework.http.ResponseEntity;
    import org.springframework.stereotype.Service;
    import org.springframework.web.multipart.MultipartFile;
    
    import com.example.comparateur.DTO.ApiResponse;
    import com.example.comparateur.DTO.PhotoResponseDTO;
    import com.example.comparateur.DTO.VoitureResponse;
    import com.example.comparateur.Entity.Photo;
    import com.example.comparateur.Entity.Review;
    import com.example.comparateur.Entity.Voiture;
    import com.example.comparateur.Repository.PhotoRepository;
    import com.example.comparateur.Repository.ReviewRepository;
    import com.example.comparateur.Repository.VoitureRepository;
    
    @Service
    public class VoitureService {
    
        @Autowired
        private VoitureRepository voitureRepository;
    
        @Autowired
        private ReviewRepository reviewRepository;
    
        @Autowired
        private PhotoRepository photoRepository;
    
        // ✅ Create a new voiture
        public ResponseEntity<Object> createVoiture(Voiture voiture) {
            try {
                voiture.setCreatedAt(LocalDateTime.now());
                voiture.setUpdatedAt(LocalDateTime.now());
                Voiture savedVoiture = voitureRepository.save(voiture);
                return ResponseEntity.ok(new ApiResponse<>(true, "Successfully created", savedVoiture));
            } catch (Exception e) {
                return ResponseEntity.status(500).body(new ApiResponse<>(false, "Failed to create. Try again"));
            }
        }
    
        // ✅ Update voiture (with optional image)
        public ResponseEntity<Object> updateVoiture(Long id, Voiture voiture, MultipartFile file) {
            Optional<Voiture> optionalVoiture = voitureRepository.findById(id);
            if (optionalVoiture.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(false, "Voiture not found"));
            }
    
            Voiture existingVoiture = optionalVoiture.get();
            existingVoiture.setCarName(voiture.getCarName());
            existingVoiture.setBrand(voiture.getBrand());
            existingVoiture.setCategory(voiture.getCategory());
            existingVoiture.setPrice(voiture.getPrice());
            existingVoiture.setUpdatedAt(LocalDateTime.now());
    
            voitureRepository.save(existingVoiture);
            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully updated", existingVoiture));
        }
    
        // ✅ Get all voitures (Paginated)
        public ResponseEntity<Object> getAllVoitures(int page) {
            Pageable pageable = PageRequest.of(Math.max(page, 0), 8);
            Page<Voiture> voiturePage = voitureRepository.findAll(pageable);
    
            if (voiturePage.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(false, "No cars found"));
            }
    
            return ResponseEntity.ok(new ApiResponse<>(true, "List of voitures", voiturePage.getContent()));
        }
    
        // ✅ Get a single voiture by ID
        public ResponseEntity<ApiResponse<Voiture>> getOneVoiture(Long id) {
            return voitureRepository.findById(id)
                    .map(voiture -> ResponseEntity.ok(new ApiResponse<>(true, "Voiture info", voiture)))
                    .orElse(ResponseEntity.status(404).body(new ApiResponse<>(false, "Voiture not found")));
        }
    
        // ✅ Get total count of voitures (Fix for Angular)
        public ResponseEntity<Object> getVoitureCount() {
            long voitureCount = voitureRepository.count();
            return ResponseEntity.ok(new ApiResponse<>(true, "Total number of voitures", voitureCount));
        }
    
        // ✅ Get all voitures with details (Fix for frontend request)
        public ResponseEntity<Object> getAllVoituresWithDetails() {
            List<Voiture> voitures = voitureRepository.findAll();
        
            if (voitures.isEmpty()) {
                return ResponseEntity.status(404).body(new ApiResponse<>(false, "No voitures found"));
            }
        
            List<VoitureResponse> voitureResponses = voitures.stream().map(voiture -> {
                // Fetch reviews safely
                List<Review> reviews = reviewRepository.findAllByVoitureId(voiture.getId());
                reviews = (reviews != null) ? reviews : Collections.emptyList(); // Prevent null issues
        
                // ✅ Fetch photos safely and convert to DTO
                List<Photo> photosList = photoRepository.findAllByVoitureId(voiture.getId()); // ✅ Corrected method name
                List<PhotoResponseDTO> photos = (photosList != null)
                        ? photosList.stream().map(PhotoResponseDTO::new).collect(Collectors.toList())
                        : Collections.emptyList(); // Prevent null issues
        
                return new VoitureResponse(voiture, photos, reviews);
            }).collect(Collectors.toList());
        
            return ResponseEntity.ok(new ApiResponse<>(true, "List of voitures with details", voitureResponses));
        }
        
        
        
    
        // ✅ Delete voiture
        public ResponseEntity<Object> deleteVoiture(Long id) {
            if (!voitureRepository.existsById(id)) {
                return ResponseEntity.status(404).body(new ApiResponse<>(false, "Voiture not found"));
            }
    
            voitureRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully deleted"));
        }
    
        // ✅ Get reviews for a voiture
        public ResponseEntity<Object> getReviewsForVoiture(Long voitureId) {
            List<Review> reviews = reviewRepository.findAllByVoitureId(voitureId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Reviews retrieved successfully", reviews));
        }
    
        // ✅ Get all photos for a voiture
        public List<PhotoResponseDTO> getPhotosByVoitureId(Long voitureId) {
            List<Photo> photosList = photoRepository.findAllByVoitureId(voitureId); // ✅ Correct method name
        
            // ✅ Handle null values safely
            if (photosList == null || photosList.isEmpty()) {
                return Collections.emptyList();
            }
        
            return photosList.stream()
                    .map(PhotoResponseDTO::new) // ✅ Corrected: Pass a `Photo` object
                    .collect(Collectors.toList());
        }
        
    }
    
