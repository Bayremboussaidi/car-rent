package com.example.comparateur.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.comparateur.DTO.EmailRequestDTO;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

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



    public void informEmail(@RequestBody EmailRequestDTO emailRequest) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(emailRequest.getEmail()); // Use the email from the JSON payload
        message.setSubject("New Message from " + emailRequest.getName());
        message.setText("Email: " + emailRequest.getEmail() + "\n\nMessage:\n" + emailRequest.getMessage());
        mailSender.send(message);
    }


    public void sendEmailWithAttachments(String to, String subject, String text, byte[] pdfAttachment, byte[] qrCodeImage) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);
            if (pdfAttachment != null) {
                helper.addAttachment("booking-confirmation.pdf", new ByteArrayResource(pdfAttachment));
                System.out.println("PDF attachment added successfully, size: " + pdfAttachment.length);
            } else {
                System.out.println("PDF attachment is null");
            }
            if (qrCodeImage != null) {
                helper.addAttachment("qr-code.png", new ByteArrayResource(qrCodeImage));
                System.out.println("QR code attachment added successfully, size: " + qrCodeImage.length);
            } else {
                System.out.println("QR code attachment is null");
            }
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}