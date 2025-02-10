package com.example.comparateur.Controller;

import com.example.Utils.ApiResponse;
import com.example.comparateur.Entity.Booking;
import com.example.comparateur.Entity.BookingStatus;
import com.example.comparateur.Service.BookingService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Object> createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOneBooking(@PathVariable Long id) {
        return bookingService.getOneBooking(id);
    }

    @GetMapping
    public ResponseEntity<Object> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateBooking(
    @PathVariable Long id, 
    @RequestBody Booking updatedBooking) {  // ✅ Accept JSON body
    System.out.println("Received request to update booking ID: " + id);
    return bookingService.updateBooking(id, updatedBooking);
}

@PutMapping("/{id}/status")
public ResponseEntity<Object> updateBookingStatus(
    @PathVariable Long id,
    @RequestBody Map<String, String> requestBody) {  // ✅ Accept JSON object
    
    try {
        String statusValue = requestBody.get("status");  // ✅ Extract status from JSON body
        System.out.println("Received API request: Update booking ID: " + id + " to " + statusValue);
        
        // ✅ Convert status to uppercase
        BookingStatus bookingStatus = BookingStatus.valueOf(statusValue.toUpperCase());
        
        return bookingService.updateBookingStatus(id, bookingStatus);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(400).body(new ApiResponse(false, "Invalid status value. Use: PENDING, CONFIRMED, DECLINED"));
    }
}


}