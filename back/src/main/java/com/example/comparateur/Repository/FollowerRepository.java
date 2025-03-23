package com.example.comparateur.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.comparateur.Entity.Follower;

public interface FollowerRepository extends JpaRepository<Follower, Long> {
}