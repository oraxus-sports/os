package com.oraxus.gateway.config;

import com.oraxus.gateway.config.properties.CognitoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;

@Configuration
public class AwsConfig {

    private final CognitoProperties cognitoProperties;

    public AwsConfig(CognitoProperties cognitoProperties) {
        this.cognitoProperties = cognitoProperties;
    }

    @Bean
    public CognitoIdentityProviderClient cognitoClient() {
        return CognitoIdentityProviderClient.builder()
                .region(Region.of(cognitoProperties.getRegion()))
                .build();
    }
}
