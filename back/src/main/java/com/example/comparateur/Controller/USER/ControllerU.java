package com.example.comparateur.Controller.USER;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.comparateur.DTO.USER.LoginRequest;
import com.example.comparateur.DTO.USER.LoginResponse;
import com.example.comparateur.Entity.User;
import com.example.comparateur.Repository.UserRepository;
import com.example.comparateur.security.USER.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class ControllerU {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;
    
    public ControllerU(AuthenticationManager authenticationManager,
                    JwtUtil jwtUtil,
                    UserDetailsService userDetailsService,
                    UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
    }
    

    // Endpoint for login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user based on the login credentials
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            // If authentication fails, return a 401 Unauthorized response
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        // Load user details from the user service
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        
        // Generate a JWT token for the authenticated user
        final String jwt = jwtUtil.generateToken(userDetails);

        // Return the JWT as part of the response body
        return ResponseEntity.ok(new LoginResponse(jwt));
    }



    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
}
