package com.example.comparateur.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.comparateur.Entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
}