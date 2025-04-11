package com.example.comparateur.Repository.chat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.comparateur.Entity.chat.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {

    public List<Chat> findByFirstUserEmail(String email);
    public List<Chat> findBySecondUserEmail(String email);

    // Custom query for the OR condition
    @Query("SELECT c FROM Chat c WHERE c.firstUserEmail = :email OR c.secondUserEmail = :email")
    public List<Chat> findByFirstUserEmailOrSecondUserEmail(String email);

    public List<Chat> findByFirstUserEmailAndSecondUserEmail(String firstUserEmail, String secondUserEmail);
}
