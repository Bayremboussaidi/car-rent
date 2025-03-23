package com.example.comparateur.Service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.comparateur.Entity.Follower;
import com.example.comparateur.Repository.FollowerRepository;

@Service
public class FollowerService {

    @Autowired
    private FollowerRepository followerRepository;

    public List<Follower> getAllFollowers() {
        return followerRepository.findAll();
    }

    public Follower addFollower(Follower follower) {
        return followerRepository.save(follower);
    }

    public void deleteFollower(Long id) {
        followerRepository.deleteById(id);
    }
}