package com.example.comparateur.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.comparateur.DTO.EmailRequestDTO;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(EmailRequestDTO emailRequest) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("bayremboussaidi187@gmail.com");
        message.setSubject("New Message from " + emailRequest.getName());
        message.setText("Email: " + emailRequest.getEmail() + "\n\nMessage:\n" + emailRequest.getMessage());
        mailSender.send(message);
    }



    public void informEmail(EmailRequestDTO emailRequest) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailRequest.getEmail());
        message.setSubject("New Message from " + emailRequest.getName());
        message.setText("Email: " + emailRequest.getEmail() + "\n\nMessage:\n" + emailRequest.getMessage());
        mailSender.send(message);
    }
}
