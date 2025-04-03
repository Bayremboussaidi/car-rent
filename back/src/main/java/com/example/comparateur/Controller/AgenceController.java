package com.example.comparateur.Controller;



import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.comparateur.Entity.Agence;
import com.example.comparateur.Service.AgenceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/agence")
public class AgenceController {

    private final AgenceService agenceService;

    public AgenceController(AgenceService agenceService) {
        this.agenceService = agenceService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<?> createAgence(@Valid @RequestBody Agence agence) {
        try {
            Agence createdAgence = agenceService.createAgence(agence);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAgence);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // READ ALL
    @GetMapping
    public List<Agence> getAllAgences() {
        return agenceService.getAllAgences();
    }



    // READ BY AGENCY NAME
    @GetMapping("/name/{agencyName}")
    public ResponseEntity<Agence> getAgenceByAgencyName(@PathVariable String agencyName) {
        Optional<Agence> agence = agenceService.getAgenceByAgencyName(agencyName);
        return agence.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAgence(
            @PathVariable Long id,
            @Valid @RequestBody Agence updatedAgence
    ) {
        try {
            Agence agence = agenceService.updateAgence(id, updatedAgence);
            return ResponseEntity.ok(agence);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAgence(@PathVariable Long id) {
        try {
            agenceService.deleteAgence(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}