/*package com.example.comparateur.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Utils.ApiResponse;
import com.example.comparateur.Entity.Booking;
import com.example.comparateur.Entity.BookingStatus;
import com.example.comparateur.Service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> createBooking(@RequestBody Booking booking) {
        if (booking.getEndDate() == null) {
            return ResponseEntity.status(400).body(new ApiResponse(false, "Error: Booking must have an end date."));
        }
        return bookingService.createBooking(booking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOneBooking(@PathVariable Long id) {
        return bookingService.getOneBooking(id);
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateBooking(
        @PathVariable Long id, 
        @RequestBody Booking updatedBooking) { 
        
        System.out.println("Received request to update booking ID: " + id);
        return bookingService.updateBooking(id, updatedBooking);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Object> updateBookingStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> requestBody) { 
    
        try {
            if (!requestBody.containsKey("status")) {
                return ResponseEntity.status(400).body(new ApiResponse(false, "Missing 'status' field in request body"));
            }

            String statusValue = requestBody.get("status");
            System.out.println("Received API request: ID=" + id + ", Status=" + statusValue);

            // ✅ Convert to uppercase to avoid case-sensitivity issues
            BookingStatus bookingStatus = BookingStatus.valueOf(statusValue.toUpperCase());

            return bookingService.updateBookingStatus(id, bookingStatus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponse(false, "Invalid status value. Use: PENDING, CONFIRMED, DECLINED"));
        }
    }
}
*/

package com.example.comparateur.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.Utils.ApiResponse;
import com.example.comparateur.Entity.Booking;
import com.example.comparateur.Service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ✅ Now booking is created using "/{id}" where {id} is voitureId
    @PostMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> createBooking(
            @PathVariable Long id,  // id represents the voitureId
            @Valid @RequestBody Booking bookingRequest) {
        
        return bookingService.createBooking(id, bookingRequest);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOneBooking(@PathVariable Long id) {
        return bookingService.getOneBooking(id);
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateBooking(
            @PathVariable Long id, 
            @RequestBody Booking updatedBooking) { 
        
        System.out.println("Received request to update booking ID: " + id);
        return bookingService.updateBooking(id, updatedBooking);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Object> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody String status) { 
    
        return bookingService.updateBookingStatus(id, status);
    }
}
