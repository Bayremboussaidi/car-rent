package com.example.comparateur.Entity.chat;



import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private int chatId;

    @Column(name = "first_user_name")
    private String firstUserName;

    @Column(name = "second_user_name")
    private String secondUserName;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "chat_id")
    private List<Message> messageList;

    // Default constructor
    public Chat() {
    }

    // Constructor with parameters
    public Chat(String firstUserName, String secondUserName, List<Message> messageList) {
        this.firstUserName = firstUserName;
        this.secondUserName = secondUserName;
        this.messageList = messageList;
    }

    // Getters and setters
    public int getChatId() {
        return chatId;
    }

    public void setChatId(int chatId) {
        this.chatId = chatId;
    }

    public String getFirstUserName() {
        return firstUserName;
    }

    public void setFirstUserName(String firstUserName) {
        this.firstUserName = firstUserName;
    }

    public String getSecondUserName() {
        return secondUserName;
    }

    public void setSecondUserName(String secondUserName) {
        this.secondUserName = secondUserName;
    }

    public List<Message> getMessageList() {
        return messageList;
    }

    public void setMessageList(List<Message> messageList) {
        this.messageList = messageList;
    }
}
