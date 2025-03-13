package com.example.comparateur.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Utils.ApiResponse;
import com.example.comparateur.Entity.Booking; // ✅ WebSocket Messaging
import com.example.comparateur.Entity.BookingStatus;
import com.example.comparateur.Repository.BookingRepository;
import com.example.comparateur.Repository.VoitureRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // ✅ WebSocket Messaging

    // ✅ Create a new booking (Client books a car → Notify Admin)
    @Transactional
    public ResponseEntity<Object> createBooking(Booking booking) {
        try {
            // ✅ 1. Validate voitureId
            if (booking.getVoitureId() == null || booking.getVoitureId().isBlank()) {
                return ResponseEntity.status(400).body(new ApiResponse(false, "Invalid voiture_id: must not be empty"));
            }
    
            // ✅ 2. Validate userId & username
            if (booking.getUserId() == null || booking.getUserId() == ' ') {
                return ResponseEntity.status(400).body(new ApiResponse(false, "User ID is required"));
            }
            if (booking.getUsername() == null || booking.getUsername().isEmpty()) {
                return ResponseEntity.status(400).body(new ApiResponse(false, "Username is required"));
            }
    
            // ✅ 3. Validate Start Date & End Date
            if (booking.getStartDate() == null || booking.getEndDate() == null) {
                return ResponseEntity.status(400).body(new ApiResponse(false, "Booking must have startDate and endDate."));
            }
            
            // ✅ 4. Ensure startDate < endDate
            if (!booking.getStartDate().isBefore(booking.getEndDate())) {
                return ResponseEntity.status(400).body(new ApiResponse(false, "End date must be after start date."));
            }
    
            // ✅ 5. Assign Pending status
            booking.setBookingStatus(BookingStatus.PENDING);
            
            // ✅ 6. Save booking
            Booking savedBooking = bookingRepository.save(booking);
    
            // ✅ 7. Notify Admin about new booking
            String adminMessage = "🚗 New booking request: " + savedBooking.getCarName() +
                                " by " + savedBooking.getUsername() +
                                " (Email: " + savedBooking.getUserEmail() + ")";
            messagingTemplate.convertAndSend("/topic/booking-requests", adminMessage);
    
            return ResponseEntity.ok().body(new ApiResponse(true, "Your voiture is booked", savedBooking));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(false, "Internal server error: " + e.getMessage()));
        }
    }
    
    

    // ✅ Update a booking (Admin updates status → Notify Client)
    @Transactional
    public ResponseEntity<Object> updateBookingStatus(Long id, BookingStatus status) {
        try {
            Optional<Booking> optionalBooking = bookingRepository.findById(id);
            if (optionalBooking.isPresent()) {
                Booking booking = optionalBooking.get();
    
                if (booking.getStartDate() == null || booking.getEndDate() == null) {
                    return ResponseEntity.status(400).body(new ApiResponse(false, "Booking must have startDate and endDate before updating status."));
                }
    
                booking.setBookingStatus(status);
                bookingRepository.save(booking);
    
                // Notify client
                String clientMessage = "✅ Your booking for " + booking.getCarName() + " is now: " + status;
                messagingTemplate.convertAndSendToUser(
                        booking.getUsername(), "/queue/booking-status", clientMessage
                );
    
                return ResponseEntity.ok().body(new ApiResponse(true, "Booking status updated successfully", booking));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Booking not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(false, "Transaction failed: " + e.getMessage()));
        }
    }
    

    // ✅ Update a booking (Admin only)
    @Transactional
    public ResponseEntity<Object> updateBooking(Long id, Booking updatedBooking) {
        try {
            Optional<Booking> optionalBooking = bookingRepository.findById(id);
            if (optionalBooking.isPresent()) {
                Booking booking = optionalBooking.get();
    
                // Validate that voitureId is provided, but don't check it in the database
                if (updatedBooking.getVoitureId() == null || updatedBooking.getVoitureId().isBlank()) {
                    return ResponseEntity.status(400).body(new ApiResponse(false, "Invalid voiture_id: must not be empty"));
                }
    
                // Validate required fields
                if (updatedBooking.getStartDate() == null || updatedBooking.getEndDate() == null) {
                    return ResponseEntity.status(400).body(new ApiResponse(false, "Booking must have startDate and endDate."));
                }
    
                // Update fields
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
                booking.setBookingStatus(updatedBooking.getBookingStatus());
                booking.setVoitureId(updatedBooking.getVoitureId()); // Now storing voitureId as a simple field
    
                bookingRepository.save(booking);
                return ResponseEntity.ok().body(new ApiResponse(true, "Booking updated successfully", booking));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Booking not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(false, "Transaction failed: " + e.getMessage()));
        }
    }
    

    // ✅ Get all bookings
    public ResponseEntity<Object> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok().body(new ApiResponse(true, "Successful", bookings));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(false, "Internal server error: " + e.getMessage()));
        }
    }

    // ✅ Get a single booking by ID
    public ResponseEntity<Object> getOneBooking(Long id) {
        try {
            Optional<Booking> booking = bookingRepository.findById(id);
            if (booking.isPresent()) {
                return ResponseEntity.ok().body(new ApiResponse(true, "Successful", booking.get()));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Booking not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse(false, "Internal server error: " + e.getMessage()));
        }
    }

    // ✅ Delete a booking
    @Transactional
    public ResponseEntity<Object> deleteBooking(Long id) {
        
            if (bookingRepository.existsById(id)) {
                bookingRepository.deleteById(id);
                return ResponseEntity.ok().body(new ApiResponse(true, "Booking deleted successfully"));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "Booking not found"));
            }
    }
}


