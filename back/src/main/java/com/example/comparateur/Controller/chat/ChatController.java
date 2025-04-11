package com.example.comparateur.Controller.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.comparateur.Entity.chat.Chat;
import com.example.comparateur.Entity.chat.Message;
import com.example.comparateur.Exception.chat.ChatNotFoundException;
import com.example.comparateur.Exception.chat.NoChatExistsInTheRepository;
import com.example.comparateur.Service.chat.ChatServiceImpl;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatServiceImpl chatService;

    @PostMapping("/add")
    public ResponseEntity<?> createChat(@RequestBody Chat chat) {
        return new ResponseEntity<>(chatService.addChat(chat), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllChats() throws NoChatExistsInTheRepository {
        return new ResponseEntity<>(chatService.findAllChats(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getChatById(@PathVariable int id) {
        try {
            return new ResponseEntity<>(chatService.getById(id), HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found", HttpStatus.NOT_FOUND);
        }
    }

    // Updated to use email instead of username
    @GetMapping("/firstUserEmail/{email}")
    public ResponseEntity<?> getChatByFirstUserEmail(@PathVariable String email) {
        try {
            List<Chat> byChat = chatService.getChatByFirstUserEmail(email);
            return new ResponseEntity<>(byChat, HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found for first user email", HttpStatus.NOT_FOUND);
        }
    }

    // Updated to use email instead of username
    @GetMapping("/secondUserEmail/{email}")
    public ResponseEntity<?> getChatBySecondUserEmail(@PathVariable String email) {
        try {
            List<Chat> byChat = chatService.getChatBySecondUserEmail(email);
            return new ResponseEntity<>(byChat, HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found for second user email", HttpStatus.NOT_FOUND);
        }
    }

    // Updated to use email instead of username
    @GetMapping("/getChatByFirstUserEmailOrSecondUserEmail/{email}")
    public ResponseEntity<?> getChatByFirstUserEmailOrSecondUserEmail(@PathVariable String email) {
        try {
            List<Chat> byChat = chatService.getChatByFirstUserEmailOrSecondUserEmail(email);
            return new ResponseEntity<>(byChat, HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found for either user email", HttpStatus.NOT_FOUND);
        }
    }

    // Updated to use email instead of username
    @GetMapping("/getChatByFirstUserEmailAndSecondUserEmail")
    public ResponseEntity<?> getChatByFirstUserEmailAndSecondUserEmail(
            @RequestParam("firstUserEmail") String firstUserEmail,
            @RequestParam("secondUserEmail") String secondUserEmail) {

        try {
            List<Chat> chatByBoth = chatService.getChatByFirstUserEmailAndSecondUserEmail(firstUserEmail, secondUserEmail);
            return new ResponseEntity<>(chatByBoth, HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found for given user emails", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/message/{chatId}")
    public ResponseEntity<?> addMessage(@RequestBody Message message, @PathVariable int chatId) {
        try {
            return new ResponseEntity<>(chatService.addMessage(message, chatId), HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found to add message", HttpStatus.NOT_FOUND);
        }
    }
}
