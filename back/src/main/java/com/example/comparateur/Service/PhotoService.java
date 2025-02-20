package com.example.comparateur.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.comparateur.Entity.Photo;
import com.example.comparateur.Repository.PhotoRepository;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private JdbcTemplate mysqlJdbcTemplate; // ✅ Connects to MySQL to verify `voiture_id`

    // ✅ Save multiple photos while verifying voiture_id in MySQL
    public List<Photo> saveMultiplePhotos(Long voitureId, MultipartFile[] files) throws IOException {
        // ✅ Check if voiture_id exists in MySQL before saving in PostgreSQL
        String sql = "SELECT COUNT(*) FROM voiture WHERE id = ?";
        Integer count = mysqlJdbcTemplate.queryForObject(sql, Integer.class, voitureId);

        if (count == null || count == 0) {
            throw new RuntimeException("Voiture ID " + voitureId + " does not exist in MySQL.");
        }

        List<Photo> savedPhotos = new ArrayList<>();

        for (MultipartFile file : files) {
            Photo photo = new Photo();
            photo.setId(UUID.randomUUID()); // ✅ Generate UUID manually
            photo.setName(file.getOriginalFilename());
            photo.setType(file.getContentType());
            photo.setData(file.getBytes());
            photo.setVoitureId(voitureId); // ✅ Store MySQL voiture.id reference

            savedPhotos.add(photoRepository.save(photo)); // ✅ Save in PostgreSQL
        }

        return savedPhotos;
    }

    // ✅ Get all photos for a specific Voiture
    public List<Photo> getPhotosByVoitureId(Long voitureId) {
        return photoRepository.findAllByVoitureId(voitureId);
    }

    // ✅ Delete all photos of a voiture
    public void deletePhotosByVoitureId(Long voitureId) {
        photoRepository.deleteByVoitureId(voitureId);
    }
}
