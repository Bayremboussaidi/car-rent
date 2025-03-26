package com.example.comparateur.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.comparateur.DTO.ReportRequest;
import com.example.comparateur.DTO.ReportResponse;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import net.glxn.qrgen.javase.QRCode;

@Service
public class ReportService {

    @Autowired
    private EmailService emailService;


    public ReportResponse generateReport(ReportRequest reportRequest) {
        // Generate QR code
        byte[] qrCodeImage = generateQRCode(reportRequest);

        // Generate PDF
        byte[] pdfReport = generatePDFReport(reportRequest, qrCodeImage);

        // Send email with PDF and QR code attachments
        emailService.sendEmailWithAttachments(reportRequest.getEmail(), "Your Booking Confirmation", "Please find your booking confirmation attached.", pdfReport, qrCodeImage);

        // Create response
        ReportResponse reportResponse = new ReportResponse();
        reportResponse.setQrCode(java.util.Base64.getEncoder().encodeToString(qrCodeImage));
        reportResponse.setPdfReport(pdfReport);

        return reportResponse;
    }

    private byte[] generateQRCode(ReportRequest reportRequest) {
        // Implementation to generate QR code
        ByteArrayOutputStream stream = QRCode.from(reportRequest.getMessage()).withSize(250, 250).stream();
        return stream.toByteArray();
    }

    private byte[] generatePDFReport(ReportRequest reportRequest, byte[] qrCodeImage) {
        try {
            Document document = new Document();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);
            document.open();
            document.add(new Paragraph("Booking Details: " + reportRequest.getMessage()));
            Image qrImage = Image.getInstance(qrCodeImage);
            document.add(qrImage);
            document.close();
            byte[] pdfBytes = baos.toByteArray();
            System.out.println("PDF generated successfully, size: " + pdfBytes.length);
            return pdfBytes;
        } catch (DocumentException | IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}