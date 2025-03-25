package com.example.comparateur.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.comparateur.DTO.EmailRequestDTO;

import io.jsonwebtoken.io.IOException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

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





















/*
    //report sender
    public void sendEmailWithReport(EmailRequestDTO emailRequest, BookingData bookingData) throws JRException, MessagingException, IOException {
        // Generate Jasper report
        File reportFile = generateJasperReport(bookingData);

        // Send email with report attached
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(emailRequest.getEmail());
        helper.setSubject("Confirmation de réservation");
        helper.setText("Bonjour " + emailRequest.getName() + ",\n\n" + emailRequest.getMessage());

        helper.addAttachment("booking_report.pdf", reportFile);
        mailSender.send(message);

        // Clean up temporary file
        reportFile.delete();
    }

    private File generateJasperReport(BookingData bookingData) throws JRException, IOException, FileNotFoundException, java.io.IOException {
        // Load JRXML file
        JasperReport jasperReport = JasperCompileManager.compileReport(getClass().getResourceAsStream("/reports/booking_report.jrxml"));

        // Create data source
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("username", bookingData.getUsername());
        parameters.put("carName", bookingData.getCarName());
        parameters.put("userEmail", bookingData.getUserEmail());
        parameters.put("nbrJrs", bookingData.getNbrJrs());
        parameters.put("phone", bookingData.getPhone());
        parameters.put("description", bookingData.getDescription());
        parameters.put("formattedDate", bookingData.getFormattedDate());

        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(List.of(bookingData));

        // Fill report
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        // Export report to PDF
        File reportFile = File.createTempFile("booking_report", ".pdf");
        JasperExportManager.exportReportToPdfStream(jasperPrint, new FileOutputStream(reportFile));

        return reportFile;
    }*/
}
