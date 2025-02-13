package com.example.comparateur.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.comparateur.Entity.Photo;
import com.example.comparateur.Entity.Voiture;
import com.example.comparateur.Repository.PhotoRepository;
import com.example.comparateur.Repository.VoitureRepository;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private VoitureRepository voitureRepository;

    // ✅ Save multiple photos
    public List<Photo> saveMultiplePhotos(Long voitureId, MultipartFile[] files) throws IOException {
        Voiture voiture = voitureRepository.findById(voitureId)
                .orElseThrow(() -> new RuntimeException("Voiture not found"));

        List<Photo> savedPhotos = new ArrayList<>();

        for (MultipartFile file : files) {
            Photo photo = new Photo();
            photo.setName(file.getOriginalFilename());
            photo.setType(file.getContentType());
            photo.setData(file.getBytes());
            photo.setVoiture(voiture);

            savedPhotos.add(photoRepository.save(photo)); // ✅ Save each photo
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
