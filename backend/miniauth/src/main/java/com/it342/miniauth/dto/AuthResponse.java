package com.it342.miniauth.dto;

public class AuthResponse {
    public String token;
    public UserResponse user;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
}