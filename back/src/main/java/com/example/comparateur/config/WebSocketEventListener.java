package com.example.comparateur.config;

// prevent notif from being lost when user logout


import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
    private final Map<String, String> activeSessions = new ConcurrentHashMap<>();

    // ✅ When a user connects, store their session
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        if (headerAccessor.getSessionAttributes() != null) {
            String username = (String) headerAccessor.getSessionAttributes().get("username");
            if (username != null) {
                activeSessions.put(username, headerAccessor.getSessionId());
                logger.info("User Connected: " + username);
            }
        }
    }

    // ✅ When a user disconnects, remove their session
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        if (headerAccessor.getSessionAttributes() != null) {
            String username = (String) headerAccessor.getSessionAttributes().get("username");
            if (username != null) {
                activeSessions.remove(username);
                logger.info("User Disconnected: " + username);
            }
        }
    }

    // ✅ Method to check if a user is still connected
    public boolean isUserConnected(String username) {
        return activeSessions.containsKey(username);
    }
}
