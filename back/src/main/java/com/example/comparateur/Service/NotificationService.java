package com.example.comparateur.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.example.comparateur.Entity.Notification;
import com.example.comparateur.Repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    // ✅ Send notification & store in database
    public void notifyUser(String recipient, String message) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .message(message)
                .seen(false)
                .build();

        notificationRepository.save(notification);
        messagingTemplate.convertAndSendToUser(recipient, "/queue/notifications", message);
    }

    // ✅ Get all unread notifications
    public List<Notification> getUnreadNotifications(String username) {
        // ✅ Fix: Ensure correct return type
        return notificationRepository.findByRecipientAndSeenFalse(username);
    }
}
