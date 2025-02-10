package com.example.comparateur.Controller;

import com.example.comparateur.Entity.Review;
import com.example.comparateur.Service.ReviewService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/{voitureId}")
    public ResponseEntity<Object> createReview(@PathVariable Long voitureId, @RequestBody Review review) {
        return reviewService.createReview(voitureId, review);
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
    
}