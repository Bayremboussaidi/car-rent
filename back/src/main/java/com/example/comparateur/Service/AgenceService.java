package com.example.comparateur.Service;



import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.comparateur.Entity.Agence;
import com.example.comparateur.Repository.AgenceRepository;




@Service
public class AgenceService {

    private final AgenceRepository agenceRepository;

    public AgenceService(AgenceRepository agenceRepository) {
        this.agenceRepository = agenceRepository;
    }

    //ADD Agence
    public Agence addAgence(Agence agence) {
        if (agenceRepository.existsByAgencyName(agence.getAgencyName())) {
            throw new IllegalArgumentException("Le nom de l'agence existe déjà");
        }
        return agenceRepository.save(agence);
    }


    //delete
    @Transactional
    public void deleteAgence(Long id) {
        if (!agenceRepository.existsById(id)) {
            throw new IllegalArgumentException("Agence not found");
        }
        agenceRepository.deleteById(id);
    }

        // READ ALL
    public List<Agence> getAllAgences() {
            return agenceRepository.findAll();
    }


    //update
    @Transactional
    public Agence updateAgence(Long id, Agence updatedAgence) {
        Agence existingAgence = agenceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agence not found"));

        // Check for duplicate agency name (if changed)
        if (!Objects.equals(existingAgence.getAgencyName(), updatedAgence.getAgencyName())) {
            if (agenceRepository.existsByAgencyName(updatedAgence.getAgencyName())) {
                throw new IllegalArgumentException("New agency name already exists");
            }
        }

        // Update fields
        existingAgence.setAgencyName(updatedAgence.getAgencyName());
        existingAgence.setEmail(updatedAgence.getEmail());
        existingAgence.setPassword(updatedAgence.getPassword());
        existingAgence.setPhoto(updatedAgence.getPhoto());
        existingAgence.setPhoneNumber(updatedAgence.getPhoneNumber());
        existingAgence.setCity(updatedAgence.getCity());

        return agenceRepository.save(existingAgence);
    }



    //GET by agence Name
    public Optional<Agence> getAgenceByAgencyName(String agencyName) {
        return agenceRepository.findByAgencyName(agencyName);
    }


        // CREATE
    public Agence createAgence(Agence agence) {
            if (agenceRepository.existsByAgencyName(agence.getAgencyName())) {
                throw new IllegalArgumentException("Agency name already exists");
            }
            return agenceRepository.save(agence);
    }
}







