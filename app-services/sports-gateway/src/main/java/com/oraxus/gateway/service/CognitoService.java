package com.oraxus.gateway.service;

import com.oraxus.gateway.config.properties.CognitoProperties;
import com.oraxus.gateway.controller.AuthController;
import com.oraxus.gateway.exception.AuthException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminInitiateAuthRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminInitiateAuthResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminRespondToAuthChallengeRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminRespondToAuthChallengeResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AuthFlowType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CognitoIdentityProviderException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminInitiateAuthRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminInitiateAuthResponse;

import java.util.HashMap;
import java.util.Map;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminCreateUserResponse;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminSetUserPasswordRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.MessageActionType;

@Service
public class CognitoService {
    private static final Logger log = LoggerFactory.getLogger(CognitoService.class);

    private final CognitoIdentityProviderClient cognitoClient;
    private final CognitoProperties cognitoProperties;
    private final UserServiceClient userServiceClient;

    public CognitoService(CognitoIdentityProviderClient cognitoClient,
                          CognitoProperties cognitoProperties,
                          UserServiceClient userServiceClient) {
        this.cognitoClient = cognitoClient;
        this.cognitoProperties = cognitoProperties;
        this.userServiceClient = userServiceClient;
    }

    private String normalizeUsername(String username) {
        if (username == null) return null;
        String s = username.trim();
        // if looks like phone and missing +, leave as-is; caller should provide E.164 if possible
        return s;
    }

    private boolean isEmail(String username) {
        return username != null && username.contains("@");
    }

    public AuthController.StartResponse startAuth(String username, String platform) {
        username = normalizeUsername(username);
        if (username == null || username.isEmpty()) {
            throw new AuthException("username.required", "Username is required");
        }

        try {
            Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", username);

            // Optionally set delivery medium or other params for distinguishing email/phone
            if (isEmail(username)) {
                authParams.put("DELIVERY_MEDIUM", "EMAIL");
            }

                String clientId = selectClientId(platform);
                String clientSecret = selectClientSecret(platform);

                    // Add SECRET_HASH if client has secret
                    if (clientSecret != null && !clientSecret.isEmpty()) {
                    String secretHash = computeSecretHash(username, clientId, clientSecret);
                    authParams.put("SECRET_HASH", secretHash);
                    }

                    AdminInitiateAuthRequest req = AdminInitiateAuthRequest.builder()
                    .userPoolId(cognitoProperties.getUserPoolId())
                        .clientId(clientId)
                    .authFlow(AuthFlowType.CUSTOM_AUTH)
                    .authParameters(authParams)
                    .build();

            AdminInitiateAuthResponse resp = cognitoClient.adminInitiateAuth(req);

            // Ensure user exists in user service (create if missing) — best-effort
            try {
                userServiceClient.ensureUserExists(username);
            } catch (Exception e) {
                log.warn("Failed to ensure user exists in user service: {}", e.getMessage());
            }

            return new AuthController.StartResponse(resp.session(), resp.challengeNameAsString());
        } catch (CognitoIdentityProviderException e) {
            log.warn("Cognito startAuth failed: {}", e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage());
            throw new AuthException("cognito.start.failed", "Failed to start authentication");
        } catch (Exception e) {
            log.error("Unexpected error in startAuth", e);
            throw new AuthException("internal.error", "Internal error");
        }
    }

    public AuthController.VerifyResponse verifyChallenge(String username, String session, String code, String platform) {
        username = normalizeUsername(username);
        if (session == null || session.isEmpty() || code == null || code.isEmpty()) {
            throw new AuthException("invalid.request", "Session and code are required");
        }

        try {
            Map<String, String> challengeResponses = new HashMap<>();
            challengeResponses.put("USERNAME", username);
            challengeResponses.put("ANSWER", code);

                String clientId = selectClientId(platform);

                    String clientSecret = selectClientSecret(platform);
                    if (clientSecret != null && !clientSecret.isEmpty()) {
                    String secretHash = computeSecretHash(username, clientId, clientSecret);
                    challengeResponses.put("SECRET_HASH", secretHash);
                    }

                    AdminRespondToAuthChallengeRequest req = AdminRespondToAuthChallengeRequest.builder()
                        .userPoolId(cognitoProperties.getUserPoolId())
                        .clientId(clientId)
                        .challengeName("CUSTOM_CHALLENGE")
                        .session(session)
                        .challengeResponses(challengeResponses)
                        .build();

            AdminRespondToAuthChallengeResponse resp = cognitoClient.adminRespondToAuthChallenge(req);

            boolean success = resp.authenticationResult() != null;
            String accessToken = null;
            String idToken = null;
            String refreshToken = null;
            if (success) {
                accessToken = resp.authenticationResult().accessToken();
                idToken = resp.authenticationResult().idToken();
                refreshToken = resp.authenticationResult().refreshToken();
            }

            return new AuthController.VerifyResponse(success, accessToken, idToken, refreshToken);
        } catch (CognitoIdentityProviderException e) {
            log.warn("Cognito verifyChallenge failed: {}", e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage());
            throw new AuthException("cognito.verify.failed", "Failed to verify authentication");
        } catch (Exception e) {
            log.error("Unexpected error in verifyChallenge", e);
            throw new AuthException("internal.error", "Internal error");
        }
    }

    /**
     * Register a new user in Cognito with username/password and optional email/phone.
     * Uses AdminCreateUser + AdminSetUserPassword to set a permanent password.
     */
    public AuthController.RegisterResponse registerUser(String username, String password, String email, String phoneNumber) {
        username = normalizeUsername(username);
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            throw new AuthException("invalid.request", "Username and password are required");
        }

        try {
            // Build attributes
            java.util.List<AttributeType> attrs = new java.util.ArrayList<>();
            if (email != null && !email.isEmpty()) {
                attrs.add(AttributeType.builder().name("email").value(email).build());
            }
            if (phoneNumber != null && !phoneNumber.isEmpty()) {
                attrs.add(AttributeType.builder().name("phone_number").value(phoneNumber).build());
            }

            AdminCreateUserRequest createReq = AdminCreateUserRequest.builder()
                    .userPoolId(cognitoProperties.getUserPoolId())
                    .username(username)
                    .userAttributes(attrs)
                    .messageAction(MessageActionType.SUPPRESS) // don't send invite
                    .build();

            AdminCreateUserResponse createResp = cognitoClient.adminCreateUser(createReq);

            // Set permanent password
            AdminSetUserPasswordRequest pwdReq = AdminSetUserPasswordRequest.builder()
                    .userPoolId(cognitoProperties.getUserPoolId())
                    .username(username)
                    .password(password)
                    .permanent(true)
                    .build();

            cognitoClient.adminSetUserPassword(pwdReq);

            // Ensure application profile exists
            try {
                userServiceClient.ensureUserExists(username);
            } catch (Exception e) {
                log.warn("Failed to ensure user exists in user service after register: {}", e.getMessage());
            }

            return new AuthController.RegisterResponse(true, "User registered");
        } catch (CognitoIdentityProviderException e) {
            log.warn("Cognito register failed: {}", e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage());
            return new AuthController.RegisterResponse(false, e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error in registerUser", e);
            throw new AuthException("internal.error", "Internal error");
        }
    }

    /**
     * Login with username and password via ADMIN_NO_SRP_AUTH.
     */
    public AuthController.LoginResponse loginUser(String username, String password, String platform) {
        username = normalizeUsername(username);
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            throw new AuthException("invalid.request", "Username and password are required");
        }

        try {
            String clientId = selectClientId(platform);
            String clientSecret = selectClientSecret(platform);

            Map<String, String> authParams = new HashMap<>();
            authParams.put("USERNAME", username);
            authParams.put("PASSWORD", password);

            if (clientSecret != null && !clientSecret.isEmpty()) {
                String secretHash = computeSecretHash(username, clientId, clientSecret);
                authParams.put("SECRET_HASH", secretHash);
            }

            AdminInitiateAuthRequest req = AdminInitiateAuthRequest.builder()
                    .userPoolId(cognitoProperties.getUserPoolId())
                    .clientId(clientId)
                    .authFlow(AuthFlowType.ADMIN_NO_SRP_AUTH)
                    .authParameters(authParams)
                    .build();

            AdminInitiateAuthResponse resp = cognitoClient.adminInitiateAuth(req);

            if (resp.authenticationResult() != null) {
                return new AuthController.LoginResponse(true,
                        resp.authenticationResult().accessToken(),
                        resp.authenticationResult().idToken(),
                        resp.authenticationResult().refreshToken(),
                        null, null, null);
            }

            // If a challenge is returned
            String session = resp.session();
            String challengeName = resp.challengeNameAsString();
            return new AuthController.LoginResponse(false, null, null, null, "challenge", session, challengeName);
        } catch (CognitoIdentityProviderException e) {
            log.warn("Cognito login failed: {}", e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage());
            return new AuthController.LoginResponse(false, null, null, null, e.awsErrorDetails() != null ? e.awsErrorDetails().errorMessage() : e.getMessage(), null, null);
        } catch (Exception e) {
            log.error("Unexpected error in loginUser", e);
            throw new AuthException("internal.error", "Internal error");
        }
    }

    private String selectClientSecret(String platform) {
        if (platform == null) {
            if (cognitoProperties.getClientSecretWeb() != null && !cognitoProperties.getClientSecretWeb().isEmpty()) {
                return cognitoProperties.getClientSecretWeb();
            }
            if (cognitoProperties.getClientSecretMobile() != null && !cognitoProperties.getClientSecretMobile().isEmpty()) {
                return cognitoProperties.getClientSecretMobile();
            }
            return null;
        }

        if ("mobile".equalsIgnoreCase(platform)) {
            String s = cognitoProperties.getClientSecretMobile();
            if (s != null && !s.isEmpty()) return s;
        }
        if ("web".equalsIgnoreCase(platform)) {
            String s = cognitoProperties.getClientSecretWeb();
            if (s != null && !s.isEmpty()) return s;
        }

        return null;
    }

    private String computeSecretHash(String username, String clientId, String clientSecret) {
        try {
            String message = username + clientId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec signingKey = new SecretKeySpec(clientSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(signingKey);
            byte[] rawHmac = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(rawHmac);
        } catch (Exception e) {
            log.error("Failed to compute SECRET_HASH", e);
            throw new AuthException("internal.error", "Failed to compute secret hash");
        }
    }

    private String selectClientId(String platform) {
        if (platform == null) {
            // prefer explicit web/mobile ids, fall back to legacy clientId
            if (cognitoProperties.getClientIdWeb() != null && !cognitoProperties.getClientIdWeb().isEmpty()) {
                return cognitoProperties.getClientIdWeb();
            }
            if (cognitoProperties.getClientId() != null && !cognitoProperties.getClientId().isEmpty()) {
                return cognitoProperties.getClientId();
            }
            throw new AuthException("cognito.client.missing", "No Cognito clientId configured");
        }

        if ("mobile".equalsIgnoreCase(platform)) {
            String id = cognitoProperties.getClientIdMobile();
            if (id != null && !id.isEmpty()) return id;
        }
        if ("web".equalsIgnoreCase(platform)) {
            String id = cognitoProperties.getClientIdWeb();
            if (id != null && !id.isEmpty()) return id;
        }

        // fallback to clientId property
        if (cognitoProperties.getClientId() != null && !cognitoProperties.getClientId().isEmpty()) {
            return cognitoProperties.getClientId();
        }

        throw new AuthException("cognito.client.missing", "No Cognito clientId configured for platform");
    }
}
