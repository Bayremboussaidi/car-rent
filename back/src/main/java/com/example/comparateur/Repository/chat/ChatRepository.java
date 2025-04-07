package com.example.comparateur.Repository.chat;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.comparateur.Entity.chat.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {

    // Find all chats by first user name
    List<Chat> findByFirstUserName(String firstUserName);

    // Find all chats by second user name
    List<Chat> findBySecondUserName(String secondUserName);

    // Find chats by either first user or second user name
    List<Chat> findByFirstUserNameOrSecondUserName(String username, String username2);

    // Find chats by both first and second user name
    List<Chat> findByFirstUserNameAndSecondUserName(String firstUserName, String secondUserName);
}

