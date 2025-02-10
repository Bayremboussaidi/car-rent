package com.example.comparateur.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.comparateur.Entity.User;
import com.example.comparateur.Repository.UserRepository;
import com.example.Utils.ApiResponse;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    // ✅ Create a new user (Now includes workplace)
    public ResponseEntity<Object> createUser(User user) {
        try {
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok().body(new ApiResponse(true, "Successfully created", savedUser));
        } catch (Exception e) {
            logger.error("Error creating user", e);
            return ResponseEntity.status(500).body(new ApiResponse(false, "Failed to create. Try again", e.getMessage()));
        }
    }

    // ✅ Update user (Now updates workplace)
    public ResponseEntity<Object> updateUser(Long id, User user) {
        try {
            Optional<User> optionalUser = userRepository.findById(id);
            if (optionalUser.isPresent()) {
                User existingUser = optionalUser.get();
                existingUser.setUsername(user.getUsername());
                existingUser.setEmail(user.getEmail());
                existingUser.setPassword(user.getPassword());
                existingUser.setPhoto(user.getPhoto());
                existingUser.setRole(user.getRole());
                existingUser.setUpdatedAt(user.getUpdatedAt());
                existingUser.setWorkplace(user.getWorkplace()); // ✅ Update workplace

                User updatedUser = userRepository.save(existingUser);
                return ResponseEntity.ok().body(new ApiResponse(true, "Successfully updated", updatedUser));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "User not found"));
            }
        } catch (Exception e) {
            logger.error("Error updating user", e);
            return ResponseEntity.status(500).body(new ApiResponse(false, "Failed to update", e.getMessage()));
        }
    }

    // ✅ Delete user
    public ResponseEntity<Object> deleteUser(Long id) {
        try {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                return ResponseEntity.ok().body(new ApiResponse(true, "Successfully deleted", id));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "User not found"));
            }
        } catch (Exception e) {
            logger.error("Error deleting user", e);
            return ResponseEntity.status(500).body(new ApiResponse(false, "Failed to delete", e.getMessage()));
        }
    }

    // ✅ Get a single user (Now includes workplace)
    public ResponseEntity<Object> getOneUser(Long id) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok().body(new ApiResponse(true, "User found", user.get()));
            } else {
                return ResponseEntity.status(404).body(new ApiResponse(false, "User not found"));
            }
        } catch (Exception e) {
            logger.error("Error retrieving user", e);
            return ResponseEntity.status(500).body(new ApiResponse(false, "Failed to retrieve user", e.getMessage()));
        }
    }

    // ✅ Get all users (Now includes workplace)
    public ResponseEntity<Object> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok().body(new ApiResponse(true, "Successful", users));
        } catch (Exception e) {
            logger.error("Failed to retrieve users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse(false, "Failed to retrieve users", null));
        }
    }
}
