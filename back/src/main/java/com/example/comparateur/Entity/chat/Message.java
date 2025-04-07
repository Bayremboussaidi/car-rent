package com.example.comparateur.Entity.chat;



import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private int messageId;

    @Column(name = "sender_email")
    private String senderEmail;

    @Column(name = "time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date time;

    @Column(name = "reply_message")
    private String replymessage;

    // Default constructor
    public Message() {
    }

    // Constructor with parameters
    public Message(String senderEmail, Date time, String replymessage) {
        this.senderEmail = senderEmail;
        this.time = time;
        this.replymessage = replymessage;
    }

    // Getters and setters
    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public String getReplymessage() {
        return replymessage;
    }

    public void setReplymessage(String replymessage) {
        this.replymessage = replymessage;
    }
}

