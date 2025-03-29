package com.example.comparateur.Service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.phone.number}")
    private String fromPhoneNumber;

    public String sendSms(String to, String message) {
        Message sms = Message.creator(
                new PhoneNumber(to),
                new PhoneNumber(fromPhoneNumber),
                message
        ).create();

        return sms.getSid(); // Returns the SMS ID for tracking
    }
}
