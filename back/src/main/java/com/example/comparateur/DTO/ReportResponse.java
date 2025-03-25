package com.example.comparateur.DTO;


public class ReportResponse {
    private String qrCode;
    private byte[] jasperReport;

    // Getters and Setters
    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public byte[] getJasperReport() {
        return jasperReport;
    }

    public void setJasperReport(byte[] jasperReport) {
        this.jasperReport = jasperReport;
    }
}