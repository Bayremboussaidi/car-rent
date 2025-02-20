package com.example.comparateur.Repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.comparateur.Entity.Photo;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, UUID> {
    
    // ✅ Find all photos linked to a specific `voiture_id`
    List<Photo> findAllByVoitureId(Long voitureId);

    // ✅ Delete all photos related to a specific `voiture_id`
    void deleteByVoitureId(Long voitureId);
}








