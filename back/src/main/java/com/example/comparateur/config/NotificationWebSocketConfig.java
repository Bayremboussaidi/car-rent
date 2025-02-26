package com.example.comparateur.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class NotificationWebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-booking") // 🔹 WebSocket endpoint
                .setAllowedOrigins("*") // 🔹 Allow requests from any frontend (Angular)
                .withSockJS(); // 🔹 Enable SockJS fallback
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/user"); // 🔹 Admin and Client notifications
        registry.setApplicationDestinationPrefixes("/app"); // 🔹 Prefix for messages sent from frontend
        registry.setUserDestinationPrefix("/user"); // 🔹 Private messages to specific users
    }
}
