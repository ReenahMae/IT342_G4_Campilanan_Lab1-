package com.it342.miniauth.dto;

public class UserResponse {
    public Long id;
    public String firstName;
    public String middleName;
    public String lastName;
    public String email;

    public UserResponse(Long id, String firstName, String middleName, String lastName, String email) {
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.email = email;
    }
}