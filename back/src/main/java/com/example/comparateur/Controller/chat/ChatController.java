package com.example.comparateur.Controller.chat;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.comparateur.Entity.chat.Chat;
import com.example.comparateur.Entity.chat.Message;
import com.example.comparateur.Exception.chat.ChatNotFoundException;
import com.example.comparateur.Exception.chat.NoChatExistsInTheRepository;
import com.example.comparateur.Service.chat.ChatServiceImpl;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/chats")
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

    @GetMapping("/firstUserName/{username}")
    public ResponseEntity<?> getChatByFirstUserName(@PathVariable String username) {
        try {
            List<Chat> byChat = chatService.getChatByFirstUserName(username);
            return new ResponseEntity<>(byChat, HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found for first username", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/secondUserName/{username}")
    public ResponseEntity<?> getChatBySecondUserName(@PathVariable String username) {
        try {
            List<Chat> byChat = chatService.getChatBySecondUserName(username);
            return new ResponseEntity<>(byChat, HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found for second username", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getChatByFirstUserNameOrSecondUserName/{username}")
    public ResponseEntity<?> getChatByFirstUserNameOrSecondUserName(@PathVariable String username) {
        try {
            List<Chat> byChat = chatService.getChatByFirstUserNameOrSecondUserName(username);
            return new ResponseEntity<>(byChat, HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found for either username", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getChatByFirstUserNameAndSecondUserName")
    public ResponseEntity<?> getChatByFirstUserNameAndSecondUserName(
            @RequestParam("firstUserName") String firstUserName,
            @RequestParam("secondUserName") String secondUserName) {

        try {
            List<Chat> chatByBoth = chatService.getChatByFirstUserNameAndSecondUserName(firstUserName, secondUserName);
            return new ResponseEntity<>(chatByBoth, HttpStatus.OK);
        } catch (ChatNotFoundException e) {
            return new ResponseEntity<>("Chat not found for given users", HttpStatus.NOT_FOUND);
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

