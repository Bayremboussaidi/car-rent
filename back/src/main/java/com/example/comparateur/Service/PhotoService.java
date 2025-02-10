package com.example.comparateur.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.comparateur.Entity.Photo;
import com.example.comparateur.Entity.Voiture;
import com.example.comparateur.Repository.PhotoRepository;
import com.example.comparateur.Repository.VoitureRepository;

import java.io.IOException;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private VoitureRepository voitureRepository;

    // Save a photo
    public Photo savePhoto(Long voitureId, MultipartFile file) throws IOException {
        Voiture voiture = voitureRepository.findById(voitureId)
                .orElseThrow(() -> new RuntimeException("Voiture not found"));

        Photo photo = new Photo();
        photo.setName(file.getOriginalFilename());
        photo.setType(file.getContentType());
        photo.setData(file.getBytes());
        photo.setVoiture(voiture);

        return photoRepository.save(photo);
    }

    // Get a photo by ID
    public Photo getPhotoById(Long id) {
        return photoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photo not found"));
    }

    


    public Photo getPhotoByVoitureId(Long voitureId) {
        Photo photo = photoRepository.findByVoitureId(voitureId);
        if (photo == null) {
            throw new RuntimeException("No photo found for voitureId: " + voitureId);
        }
        return photo;
    }

    // Delete a photo by ID
    public void deletePhotoById(Long id) {
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        photoRepository.delete(photo);
    }
    

    public Photo updatePhoto(Long id, MultipartFile file) throws IOException {
        Photo photo = photoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photo not found"));

        photo.setName(file.getOriginalFilename());
        photo.setType(file.getContentType());
        photo.setData(file.getBytes());

        return photoRepository.save(photo);
    }
}