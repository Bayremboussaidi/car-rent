package com.example.comparateur.Service.chat;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // Add a new chat, MySQL will auto-generate the chatId
    public Chat addChat(Chat chat) {
        return chatRepository.save(chat);
    }

    // Get all chats
    public List<Chat> findAllChats() throws NoChatExistsInTheRepository {
        if (chatRepository.findAll().isEmpty()) {
            throw new NoChatExistsInTheRepository();
        } else {
            return chatRepository.findAll();
        }
    }

    // Get chat by ID
    public Chat getById(int id) throws ChatNotFoundException {
        Optional<Chat> chat = chatRepository.findById(id);
        if (chat.isPresent()) {
            return chat.get();
        } else {
            throw new ChatNotFoundException();
        }
    }

    // Get chats by first user email
    public List<Chat> getChatByFirstUserEmail(String email) throws ChatNotFoundException {
        List<Chat> chat = chatRepository.findByFirstUserEmail(email);
        if (chat.isEmpty()) {
            throw new ChatNotFoundException();
        } else {
            return chat;
        }
    }

    // Get chats by second user email
    public List<Chat> getChatBySecondUserEmail(String email) throws ChatNotFoundException {
        List<Chat> chat = chatRepository.findBySecondUserEmail(email);
        if (chat.isEmpty()) {
            throw new ChatNotFoundException();
        } else {
            return chat;
        }
    }

    // Get chats by either first or second user email
    public List<Chat> getChatByFirstUserEmailOrSecondUserEmail(String email) throws ChatNotFoundException {
        List<Chat> chatFirstUser = chatRepository.findByFirstUserEmail(email);
        List<Chat> chatSecondUser = chatRepository.findBySecondUserEmail(email);

        chatFirstUser.addAll(chatSecondUser);

        if (chatFirstUser.isEmpty()) {
            throw new ChatNotFoundException();
        } else {
            return chatFirstUser;
        }
    }

    // Get chat by both first and second user email
    public List<Chat> getChatByFirstUserEmailAndSecondUserEmail(String firstUserEmail, String secondUserEmail) throws ChatNotFoundException {
        List<Chat> chat = chatRepository.findByFirstUserEmailAndSecondUserEmail(firstUserEmail, secondUserEmail);
        if (chat.isEmpty()) {
            throw new ChatNotFoundException();
        } else {
            return chat;
        }
    }

    // Add a message to an existing chat
    public Chat addMessage(Message add, int chatId) throws ChatNotFoundException {
        Optional<Chat> chat = chatRepository.findById(chatId);
        if (chat.isPresent()) {
            Chat existingChat = chat.get();

            // Adding the message to the chat's message list
            List<Message> messages = existingChat.getMessageList();
            if (messages == null) {
                messages = new ArrayList<>();
            }
            messages.add(add);
            existingChat.setMessageList(messages);

            // Save the message itself to the message table
            messageRepository.save(add);
            // Save the updated chat with the new message
            return chatRepository.save(existingChat);
        } else {
            throw new ChatNotFoundException();
        }
    }
}
