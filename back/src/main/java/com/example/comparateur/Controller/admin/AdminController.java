package com.example.comparateur.Controller.admin;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
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
import com.example.comparateur.security.ADMIN.AdminJwtUtil;
import com.example.comparateur.security.ADMIN.PasswordUtil;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthenticationManager authenticationManager;
    private final AdminJwtUtil adminJwtUtil;
    private final AdminRepository adminRepository;

    public AdminController(AuthenticationManager authenticationManager,
                        AdminJwtUtil adminJwtUtil,
                        AdminRepository adminRepository) {
        this.authenticationManager = authenticationManager;
        this.adminJwtUtil = adminJwtUtil;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest loginRequest) {
        try {
            // Authenticate the admin based on the login credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    
        // Load admin details from the repository
        final Admin admin = adminRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    
        // Generate JWT token for the authenticated admin
        final String jwt = adminJwtUtil.generateToken((UserDetails) admin, admin);
    
        // Return the JWT as part of the response body
        return ResponseEntity.ok(new AdminLoginResponse(jwt));
    }
    






    //signup
        @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        // Check if the email already exists
        if (adminRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email is already in use.");
        }

        // Create a new admin object
        Admin newAdmin = new Admin();
        newAdmin.setEmail(signupRequest.getEmail());
        newAdmin.setUsername(signupRequest.getUsername());
        newAdmin.setPhone(signupRequest.getPhone());
        newAdmin.setWorkplace(signupRequest.getWorkplace());

        // Hash the password
        String hashedPassword = PasswordUtil.hashPassword(signupRequest.getPassword());
        newAdmin.setPassword(hashedPassword);

        // Save the admin to the repository
        adminRepository.save(newAdmin);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new SignupResponse("Admin registered successfully."));
    }
}
