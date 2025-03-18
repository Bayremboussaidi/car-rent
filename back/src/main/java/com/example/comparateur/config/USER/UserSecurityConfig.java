package com.example.comparateur.config.USER;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.comparateur.security.USER.JwtAuthFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class UserSecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    public UserSecurityConfig(JwtAuthFilter jwtAuthFilter, UserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean("userSecurityFilterChain")  // Renamed bean name here to avoid conflict
    public SecurityFilterChain userSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csf -> csf.disable())
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/api/auth/login").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(mng -> mng
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                        .and()
                        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class));
        return http.build();
    }

    @Bean("userPasswordEncoder")  // Renamed to avoid conflict with the other passwordEncoder bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
