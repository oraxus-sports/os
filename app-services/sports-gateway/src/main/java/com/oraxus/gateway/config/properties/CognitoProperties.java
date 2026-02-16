package com.oraxus.gateway.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "cognito")
public class CognitoProperties {
    private String region;
    private String userPoolId;
    private String clientId;
    private String clientIdWeb;
    private String clientIdMobile;
    private String clientSecretWeb;
    private String clientSecretMobile;

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getUserPoolId() {
        return userPoolId;
    }

    public void setUserPoolId(String userPoolId) {
        this.userPoolId = userPoolId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientIdWeb() {
        return clientIdWeb;
    }

    public void setClientIdWeb(String clientIdWeb) {
        this.clientIdWeb = clientIdWeb;
    }

    public String getClientIdMobile() {
        return clientIdMobile;
    }

    public void setClientIdMobile(String clientIdMobile) {
        this.clientIdMobile = clientIdMobile;
    }

    public String getClientSecretWeb() {
        return clientSecretWeb;
    }

    public void setClientSecretWeb(String clientSecretWeb) {
        this.clientSecretWeb = clientSecretWeb;
    }

    public String getClientSecretMobile() {
        return clientSecretMobile;
    }

    public void setClientSecretMobile(String clientSecretMobile) {
        this.clientSecretMobile = clientSecretMobile;
    }
}
