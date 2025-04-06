package com.example.comparateur.Controller;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.comparateur.DTO.AGENCE.AgenceRequestDTO;
import com.example.comparateur.DTO.AGENCE.AgenceResponseDTO;
import com.example.comparateur.DTO.AGENCE.AgenceUpdateDTO;
import com.example.comparateur.Exception.AgencyAlreadyExistsException;
import com.example.comparateur.Exception.AgencyNotFoundException;
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
    public ResponseEntity<?> createAgence(@Valid @RequestBody AgenceRequestDTO agenceDTO) {
        try {
            AgenceResponseDTO createdAgence = agenceService.createAgence(agenceDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAgence);
        } catch (AgencyAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // READ ALL (paginated)
    @GetMapping
    public ResponseEntity<Page<AgenceResponseDTO>> getAllAgences(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(agenceService.getAllAgences(pageable));
    }

    // READ BY AGENCY NAME
    @GetMapping("/name/{agencyName}")
    public ResponseEntity<AgenceResponseDTO> getAgenceByAgencyName(@PathVariable String agencyName) {
        try {
            return ResponseEntity.ok(agenceService.getAgenceByAgencyName(agencyName));
        } catch (AgencyNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAgence(
            @PathVariable Long id,
            @Valid @RequestBody AgenceUpdateDTO updateDTO) {
        try {
            AgenceResponseDTO updatedAgence = agenceService.updateAgence(id, updateDTO);
            return ResponseEntity.ok(updatedAgence);
        } catch (AgencyNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (AgencyAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAgence(@PathVariable Long id) {
        try {
            agenceService.deleteAgence(id);
            return ResponseEntity.noContent().build();
        } catch (AgencyNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // SEARCH
    @GetMapping("/search")
    public ResponseEntity<Page<AgenceResponseDTO>> searchAgencies(
            @RequestParam String query,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(agenceService.searchAgencies(query, pageable));
    }
}