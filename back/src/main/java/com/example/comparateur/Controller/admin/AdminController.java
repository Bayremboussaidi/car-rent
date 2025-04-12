package com.example.comparateur.Controller.admin;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.comparateur.DTO.admin.AdminLoginRequest;
import com.example.comparateur.DTO.admin.AdminLoginResponse;
import com.example.comparateur.DTO.admin.SignupRequest;
import com.example.comparateur.DTO.admin.SignupResponse;
import com.example.comparateur.Entity.admin.Admin;
import com.example.comparateur.Repository.admin.AdminRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminController(AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }


    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest loginRequest) {
        Admin admin = adminRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    
        if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    
        // Convert Set<Role> to List<String>
        List<String> roleNames = admin.getRoles().stream()
                .map(role -> role.name()) // Convert Role enum to string
                .collect(Collectors.toList());
    
        return ResponseEntity.ok(
                new AdminLoginResponse(
                        "Login successful",
                        admin.getUsername(),
                        admin.getEmail(),
                        admin.getPhone(),
                        admin.getWorkplace(),
                        roleNames // Should contain "ADMIN" if the role is assigned properly
                )
        );
    }
    
    

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        if (adminRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new SignupResponse("Email is already in use."));
        }

        Admin newAdmin = new Admin();
        newAdmin.setEmail(signupRequest.getEmail());
        newAdmin.setUsername(signupRequest.getUsername());
        newAdmin.setPhone(signupRequest.getPhone());
        newAdmin.setWorkplace(signupRequest.getWorkplace());

        String hashedPassword = passwordEncoder.encode(signupRequest.getPassword());
        newAdmin.setPassword(hashedPassword);

        // Optional: You can set default role(s) here if needed
        // newAdmin.getRoles().add(Role.ADMIN);

        adminRepository.save(newAdmin);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new SignupResponse("Admin registered successfully."));
    }
}
