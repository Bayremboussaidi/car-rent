package com.example.comparateur.Service.chat;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.comparateur.Entity.chat.Chat;
import com.example.comparateur.Entity.chat.Message;
import com.example.comparateur.Exception.chat.ChatNotFoundException;
import com.example.comparateur.Exception.chat.NoChatExistsInTheRepository;
import com.example.comparateur.Repository.chat.ChatRepository;
import com.example.comparateur.Repository.chat.MessageRepository;

@Service
public class ChatServiceImpl {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

    public Chat addChat(Chat chat) {
        return chatRepository.save(chat);
    }

    public List<Chat> findAllChats() throws NoChatExistsInTheRepository {
        List<Chat> chats = chatRepository.findAll();
        if (chats.isEmpty()) {
            throw new NoChatExistsInTheRepository();
        }
        return chats;
    }

    public Chat getById(int id) throws ChatNotFoundException {
        return chatRepository.findById(id)
            .orElseThrow(ChatNotFoundException::new);
    }

    public List<Chat> getChatByFirstUserEmail(String email) throws ChatNotFoundException {
        List<Chat> chats = chatRepository.findByFirstUserEmail(email);
        if (chats.isEmpty()) {
            throw new ChatNotFoundException();
        }
        return chats;
    }

    public List<Chat> getChatBySecondUserEmail(String email) throws ChatNotFoundException {
        List<Chat> chats = chatRepository.findBySecondUserEmail(email);
        if (chats.isEmpty()) {
            throw new ChatNotFoundException();
        }
        return chats;
    }

    public List<Chat> getChatByFirstUserEmailOrSecondUserEmail(String email) throws ChatNotFoundException {
        List<Chat> chats = chatRepository.findByFirstUserEmailOrSecondUserEmail(email);
        if (chats.isEmpty()) {
            throw new ChatNotFoundException();
        }
        return chats;
    }

    public List<Chat> getChatByFirstUserEmailAndSecondUserEmail(String firstUserEmail, String secondUserEmail) 
        throws ChatNotFoundException {
        List<Chat> chats = chatRepository.findChatByEmailsBidirectional(firstUserEmail, secondUserEmail);
        if (chats.isEmpty()) {
            throw new ChatNotFoundException();
        }
        return chats;
    }

    @Transactional
    public Chat addMessage(Message newMessage, int chatId) throws ChatNotFoundException {
        Chat chat = chatRepository.findById(chatId)
            .orElseThrow(ChatNotFoundException::new);

        // Set bidirectional relationship
        newMessage.setChat(chat);
        
        // Initialize message list if needed
        if (chat.getMessageList() == null) {
            chat.setMessageList(new ArrayList<>());
        }
        
        // Add message to chat's collection
        chat.getMessageList().add(newMessage);
        
        // Cascade save through chat repository
        return chatRepository.save(chat);
    }
}