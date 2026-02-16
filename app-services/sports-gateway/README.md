# Sports Gateway (Authentication)

This module implements an authentication gateway that uses Amazon Cognito for OTP-based authentication (email and mobile). It exposes simple REST endpoints to start an authentication challenge and to verify the OTP.

Important: This scaffold assumes you have configured a Cognito User Pool with a client that uses the CUSTOM_AUTH flow and appropriate Lambda triggers to deliver OTP codes. Update `src/main/resources/application.yml` with your Cognito `userPoolId`, `clientId` and AWS `region`.

Endpoints:
- POST /auth/start  -> start OTP flow (body: { "username": "user@example.com" })
- POST /auth/verify -> verify OTP (body: { "username":"...", "session":"...", "code":"123456" })

The gateway will consult the `user-service.url` configured in `application.yml` to create/fetch users as needed.
