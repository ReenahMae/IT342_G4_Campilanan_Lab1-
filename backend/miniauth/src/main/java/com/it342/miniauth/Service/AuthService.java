package com.it342.miniauth.Service;

import com.it342.miniauth.Security.JwtService;
import com.it342.miniauth.dto.*;
import com.it342.miniauth.Entity.User;
import com.it342.miniauth.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtService jwtService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.email)) {
            throw new RuntimeException("Email already exists");
        }

        User u = new User();
        u.setFirstName(req.firstName);
        u.setMiddleName(req.middleName);
        u.setLastName(req.lastName);
        u.setEmail(req.email);
        u.setPasswordHash(encoder.encode(req.password));

        userRepo.save(u);
    }

    public AuthResponse login(LoginRequest req) {
        User u = userRepo.findByEmail(req.email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(req.password, u.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(u.getEmail());

        UserResponse user = new UserResponse(
                u.getId(),
                u.getFirstName(),
                u.getMiddleName(),
                u.getLastName(),
                u.getEmail()
        );

        return new AuthResponse(token, user);
    }
}
