package com.example.comparateur.Controller;

import com.example.comparateur.Service.UserService;
import com.example.comparateur.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Object> createUser(@RequestBody User user) {
        return userService.createUser(user);
        
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOneUser(@PathVariable Long id) {
        return userService.getOneUser(id);
    }

    @GetMapping
    public ResponseEntity<Object> getAllUsers() {
        return userService.getAllUsers();
    }
}
