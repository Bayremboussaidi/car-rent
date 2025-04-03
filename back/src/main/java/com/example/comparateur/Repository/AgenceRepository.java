package com.example.comparateur.Repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.comparateur.Entity.Agence;

public interface AgenceRepository extends JpaRepository<Agence, Long> {
    boolean existsByAgencyName(String agencyName);
    Optional<Agence> findByAgencyName(String agencyName);
}
