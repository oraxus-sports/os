package com.oraxus.gateway.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class UserServiceClient {
    private static final Logger log = LoggerFactory.getLogger(UserServiceClient.class);

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${user-service.url}")
    private String userServiceUrl;

    /**
     * Ensure a minimal user record exists; best-effort POST to user service.
     */
    public void ensureUserExists(String username) {
        try {
            String url = userServiceUrl + "/api/users/ensure"; // expected endpoint in user service
            Map<String, String> body = new HashMap<>();
            body.put("username", username);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> req = new HttpEntity<>(body, headers);

            restTemplate.postForEntity(url, req, String.class);
        } catch (Exception e) {
            log.warn("ensureUserExists failed: {}", e.getMessage());
        }
    }
}
