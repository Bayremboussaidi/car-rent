package com.example.comparateur.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.comparateur.Entity.Follower;

public interface FollowerRepository extends JpaRepository<Follower, Long> {

    

    Optional<Follower> findByEmail(String email);
}