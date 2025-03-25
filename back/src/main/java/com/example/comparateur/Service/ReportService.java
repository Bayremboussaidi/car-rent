package com.example.comparateur.Service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.comparateur.DTO.ReportRequest;
import com.example.comparateur.DTO.ReportResponse;

import net.glxn.qrgen.javase.QRCode;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

@Service
public class ReportService {

    public ReportResponse generateReport(ReportRequest reportRequest) {
        // Generate QR code
        String qrCode = generateQRCode(reportRequest);

        // Generate Jasper Report
        byte[] jasperReport = generateJasperReport(reportRequest, qrCode);

        // Create response
        ReportResponse reportResponse = new ReportResponse();
        reportResponse.setQrCode(qrCode);
        reportResponse.setJasperReport(jasperReport);

        return reportResponse;
    }

    private String generateQRCode(ReportRequest reportRequest) {
        // Implementation to generate QR code
        ByteArrayOutputStream stream = QRCode.from(reportRequest.getMessage()).withSize(250, 250).stream();
        return java.util.Base64.getEncoder().encodeToString(stream.toByteArray());
    }

    private byte[] generateJasperReport(ReportRequest reportRequest, String qrCode) {
        try {
            // Compile the Jasper report from .jrxml to .jasper
            JasperReport jasperReport = JasperCompileManager.compileReport("path/to/your/report_template.jrxml");

            // Parameters for report
            Map<String, Object> parameters = new HashMap<>();
            parameters.put("name", reportRequest.getName());
            parameters.put("email", reportRequest.getEmail());
            parameters.put("message", reportRequest.getMessage());
            parameters.put("qrCode", qrCode);

            // Data source
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(java.util.Collections.singletonList(reportRequest));

            // Fill the report
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

            // Export the report to a byte array
            return JasperExportManager.exportReportToPdf(jasperPrint);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}