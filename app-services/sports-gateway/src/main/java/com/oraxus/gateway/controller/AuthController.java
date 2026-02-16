package com.oraxus.gateway.controller;

import com.oraxus.gateway.service.CognitoService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final CognitoService cognitoService;

    public AuthController(CognitoService cognitoService) {
        this.cognitoService = cognitoService;
    }

    @PostMapping("/start")
    public ResponseEntity<StartResponse> start(@Valid @RequestBody StartRequest req) {
        StartResponse resp = cognitoService.startAuth(req.getUsername(), req.getPlatform());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest req) {
        RegisterResponse resp = cognitoService.registerUser(req.getUsername(), req.getPassword(), req.getEmail(), req.getPhoneNumber());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        LoginResponse resp = cognitoService.loginUser(req.getUsername(), req.getPassword(), req.getPlatform());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyResponse> verify(@Valid @RequestBody VerifyRequest req) {
        VerifyResponse resp = cognitoService.verifyChallenge(req.getUsername(), req.getSession(), req.getCode(), req.getPlatform());
        return ResponseEntity.ok(resp);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StartRequest {
        private String username; // email or phone
        private String platform; // optional: "web" or "mobile"
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StartResponse {
        private String session; // Cognito session token for next step
        private String challengeName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyRequest {
        private String username;
        private String session;
        private String code;
        private String platform; // optional: "web" or "mobile"
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String username;
        private String password;
        private String email;
        private String phoneNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterResponse {
        private boolean success;
        private String message;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
        private String platform; // optional: "web" or "mobile"
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private boolean success;
        private String accessToken;
        private String idToken;
        private String refreshToken;
        private String message;
        private String session; // present if further challenge required
        private String challengeName;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyResponse {
        private boolean success;
        private String accessToken;
        private String idToken;
        private String refreshToken;
    }
}
