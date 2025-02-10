package com.example.comparateur.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.comparateur.Entity.Booking;
import com.example.comparateur.Entity.BookingStatus;
import com.example.comparateur.Entity.Voiture;
import com.example.comparateur.Repository.BookingRepository;
import com.example.comparateur.Repository.VoitureRepository;
import com.example.Utils.ApiResponse;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VoitureRepository voitureRepository;


    // ✅ Create a new booking (Default Status: PENDING)
    @Transactional
    public ResponseEntity<Object> createBooking(Booking booking) {
        try {
            if (booking.getVoiture() == null || booking.getVoiture().getId() == null) {
                return ResponseEntity.status(400).body(new ApiResponse(false, "Invalid voiture_id"));
            }
    
            booking.setStatus(BookingStatus.PENDING); // ✅ Set default status
            Booking savedBooking = bookingRepository.save(booking);
            
            return ResponseEntity.ok().body(new ApiResponse(true, "Your voiture is booked", savedBooking));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Internal server error"));
        }
    }
    

    // ✅ Update booking status (Admin Approves/Rejects)

public ResponseEntity<Object> updateBooking(Long id, Booking updatedBooking) {
    try {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();

            // ✅ Ensure voiture exists before updating
            if (updatedBooking.getVoiture() != null && updatedBooking.getVoiture().getId() != null) {
                Optional<Voiture> optionalVoiture = voitureRepository.findById(updatedBooking.getVoiture().getId());
                if (optionalVoiture.isPresent()) {
                    booking.setVoiture(optionalVoiture.get());
                } else {
                    return ResponseEntity.status(400).body(new ApiResponse(false, "Invalid voiture_id"));
                }
            }

            // ✅ Update all other fields safely
            booking.setUsername(updatedBooking.getUsername());
            booking.setCarName(updatedBooking.getCarName());
            booking.setUserEmail(updatedBooking.getUserEmail());
            booking.setNbrJrs(updatedBooking.getNbrJrs());
            booking.setPhone(updatedBooking.getPhone());
            booking.setDescription(updatedBooking.getDescription());
            booking.setStartDate(updatedBooking.getStartDate());
            booking.setEndDate(updatedBooking.getEndDate());
            booking.setPickupLocation(updatedBooking.getPickupLocation());
            booking.setDropoffLocation(updatedBooking.getDropoffLocation());
            booking.setStatus(updatedBooking.getStatus());

            bookingRepository.save(booking);
            return ResponseEntity.ok().body(new ApiResponse(true, "Booking updated successfully", booking));
        } else {
            return ResponseEntity.status(404).body(new ApiResponse(false, "Booking not found"));
        }
    } catch (Exception e) {
        e.printStackTrace();  // ✅ Print stack trace for debugging
        return ResponseEntity.status(500).body(new ApiResponse(false, "Transaction failed: " + e.getMessage()));
    }
}

    
    

    // ✅ Get all bookings
    public ResponseEntity<Object> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok().body(new ApiResponse(true, "Successful", bookings));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Internal server error"));
        }
    }

    // ✅ Get a single booking by ID
    public ResponseEntity<Object> getOneBooking(Long id) {
        try {
            Optional<Booking> booking = bookingRepository.findById(id);
            if (booking.isPresent()) {
                return ResponseEntity.ok().body(new ApiResponse(true, "Successful", booking.get()));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Internal server error"));
        }
    }

    // ✅ Delete a booking
    @Transactional
    public ResponseEntity<Object> deleteBooking(Long id) {
        try {
            if (bookingRepository.existsById(id)) {
                bookingRepository.deleteById(id);
                return ResponseEntity.ok().body(new ApiResponse(true, "Booking deleted successfully"));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Booking not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse(false, "Error deleting booking"));
        }
    }

    
    @Transactional
    public ResponseEntity<Object> updateBookingStatus(Long id, BookingStatus status) {
        try {
            Optional<Booking> optionalBooking = bookingRepository.findById(id);
            if (optionalBooking.isPresent()) {
                Booking booking = optionalBooking.get();
                
                System.out.println("Updating booking ID: " + id + " to status: " + status);
    
                // ✅ Set new status
                booking.setStatus(status);
                
                // ✅ Save the updated booking
                bookingRepository.save(booking);
                
                return ResponseEntity.ok().body(new ApiResponse(true, "Booking status updated successfully", booking));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Booking not found"));
            }
        } catch (Exception e) {
            e.printStackTrace(); // ✅ Print stack trace for debugging
            return ResponseEntity.status(500).body(new ApiResponse(false, "Transaction failed: " + e.getMessage()));
        }
    }
    
    

    
}
