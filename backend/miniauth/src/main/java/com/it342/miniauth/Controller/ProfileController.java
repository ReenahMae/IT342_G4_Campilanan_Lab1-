package com.it342.miniauth.Controller;

import com.it342.miniauth.Entity.User;
import com.it342.miniauth.Repository.UserRepository;
import com.it342.miniauth.Security.JwtService;
import com.it342.miniauth.dto.ProfileUpdateRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final JwtService jwtService;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public ProfileController(JwtService jwtService,
                             UserRepository userRepo,
                             PasswordEncoder encoder) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    private String extractToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) return null;
        return header.substring(7);
    }

    @GetMapping
    public User getProfile(
            @RequestHeader(value = "Authorization", required = false) String auth) {

        String token = extractToken(auth);

        if (token == null || !jwtService.isTokenValid(token)) {
            throw new RuntimeException("Unauthorized");
        }

        String email = jwtService.extractEmail(token);

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping
    public User updateProfile(
            @RequestHeader(value = "Authorization", required = false) String auth,
            @RequestBody ProfileUpdateRequest request) {

        String token = extractToken(auth);

        if (token == null || !jwtService.isTokenValid(token)) {
            throw new RuntimeException("Unauthorized");
        }

        String email = jwtService.extractEmail(token);

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.firstName);
        user.setMiddleName(request.middleName);
        user.setLastName(request.lastName);

        if (request.newPassword != null && !request.newPassword.isBlank()) {
            user.setPasswordHash(encoder.encode(request.newPassword));
        }

        return userRepo.save(user);
    }
}
