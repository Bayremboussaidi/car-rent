package com.example.comparateur.Controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.example.comparateur.config.WebSocketEventListener;

@Controller
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private WebSocketEventListener webSocketEventListener; // ✅ Track active users

    // ✅ Broadcast notification to all users
    @MessageMapping("/notify") 
    public void sendNotification(String message) {
        messagingTemplate.convertAndSend("/topic/notifications", message);
    }

    // ✅ Send a private notification (only if user is online)
    public void sendPrivateNotification(String username, String message) {
        if (webSocketEventListener.isUserConnected(username)) {
            messagingTemplate.convertAndSendToUser(username, "/queue/private", message);
        } else {
            // Store notification in the database so user sees it later
            // TODO: Implement a database storage mechanism for offline users
            System.out.println("User is offline, storing notification for later...");
        }
    }
}

