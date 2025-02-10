package com.example.comparateur.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.comparateur.Entity.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    // Custom query methods can be added here if needed
    Photo findByVoitureId(Long voitureId);

}