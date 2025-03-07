package com.example.comparateur.Service;


import com.example.comparateur.Entity.Photo;
import com.example.comparateur.Entity.Voiture;
import com.example.comparateur.Repository.PhotoRepository;
import com.example.comparateur.Repository.VoitureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PhotoService {

    @Autowired
    private PhotoRepository photoRepository;

    @Autowired
    private VoitureRepository voitureRepository;

    @Transactional
    public List<Photo> saveMultiplePhotos(Long voitureId, MultipartFile[] files) throws IOException {
        Voiture voiture = voitureRepository.findById(voitureId)
                .orElseThrow(() -> new RuntimeException("Voiture not found with id: " + voitureId));

        List<Photo> photos = new ArrayList<>();
        for (MultipartFile file : files) {
            Photo photo = new Photo();
            photo.setName(file.getOriginalFilename());
            photo.setType(file.getContentType());
            photo.setData(file.getBytes());
            photo.setVoiture(voiture);
            photos.add(photoRepository.save(photo));
        }
        return photos;
    }

    public List<Photo> getPhotosByVoitureId(Long voitureId) {
        return photoRepository.findAllByVoitureId(voitureId);
    }

    public void deletePhotosByVoitureId(Long voitureId) {
        photoRepository.deleteByVoitureId(voitureId);
    }
}