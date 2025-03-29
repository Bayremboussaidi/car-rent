package com.example.comparateur.Controller;

import org.springframework.web.bind.annotation.*;

import com.example.comparateur.DTO.SmsRequest;
import com.example.comparateur.Service.SmsService;

@RestController
@RequestMapping("/sms")
public class SmsController {

    private final SmsService smsService;

    public SmsController(SmsService smsService) {
        this.smsService = smsService;
    }

    @PostMapping("/send")
    public String sendSms(@RequestBody SmsRequest smsRequest) {
        return smsService.sendSms(smsRequest.getTo(), smsRequest.getMessage());
    }
}
