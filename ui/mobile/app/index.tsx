import { useState } from 'react';
import { View, Text, ImageBackground, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SignUpMobile } from '../components/SignUpMobile';
import { useTranslation } from 'react-i18next';
import './i18n';

const sportsBackground = require('../assets/sports-background.png');

export default function SignUpScreen() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: any) => {
    setIsLoading(true);
    console.log('Sign up data:', data);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Account created! Sign in method: ${data.signInMethod}`);
    }, 2000);
  };

  const handleSignInClick = () => {
    console.log('Navigate to sign in');
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'hi', label: 'हिन्दी' },
  ];

  return (
    <ImageBackground 
      source={sportsBackground}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      <ScrollView contentContainerStyle={styles.container}>
        {/* Language Switcher */}
        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => changeLanguage(lang.code)}
              style={[
                styles.languageButton,
                i18n.language === lang.code && styles.languageButtonActive
              ]}
            >
              <Text style={[
                styles.languageText,
                i18n.language === lang.code && styles.languageTextActive
              ]}>
                {lang.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Sign Up Form */}
        <View style={styles.formCard}>
          <SignUpMobile
            onSubmit={handleSignUp}
            onSignInClick={handleSignInClick}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageButtonActive: {
    backgroundColor: 'rgba(14, 165, 233, 0.8)',
  },
  languageText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  languageTextActive: {
    color: '#ffffff',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
  },
});
