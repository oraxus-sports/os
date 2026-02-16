import { useState, useEffect } from 'react';
import { View, Text, ImageBackground, ScrollView, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignUpMobile } from '../components/SignUpMobile';
import SignInMobile from './components/SignIn';
import auth from '@sports-os/lib/services/auth';
import ThemeSelector from '../components/ThemeSelector';
import { useTranslation } from 'react-i18next';
import './i18n';

const sportsBackground = require('../assets/sports-background.png');

export default function SignUpScreen() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = { username: data.username || data.email, password: data.password, email: data.email, phoneNumber: data.phone };
      const res = await auth.register(payload as any);
      setIsLoading(false);
      if (res && res.success) {
        alert('Account created — please sign in');
      } else {
        alert('Registration failed: ' + (res?.message || JSON.stringify(res)));
      }
    } catch (e: any) {
      setIsLoading(false);
      alert('Registration error: ' + (e?.message || e));
    }
  };

  const [showSignIn, setShowSignIn] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  // load persisted theme and language on mount
  useEffect(() => {
    (async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('@sports:theme');
        if (storedTheme === 'light' || storedTheme === 'dark') setTheme(storedTheme);

        const storedLang = await AsyncStorage.getItem('@sports:lang');
        if (storedLang) {
          i18n.changeLanguage(storedLang);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const handleSignInClick = () => setShowSignIn(true);

  const handleSignIn = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = { username: data.email || data.phone, password: data.password, platform: 'mobile' };
      const res = await auth.login(payload as any);
      setIsLoading(false);
      if (res && res.success) {
        alert('Signed in');
      } else if (res && res.session) {
        alert('Additional challenge required');
      } else {
        alert('Sign in failed: ' + (res?.message || JSON.stringify(res)));
      }
    } catch (e: any) {
      setIsLoading(false);
      alert('Sign in error: ' + (e?.message || e));
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    try { AsyncStorage.setItem('@sports:lang', lng); } catch (e) {}
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
        <ThemeSelector
          theme={theme}
          onChange={async (t) => {
            setTheme(t);
            try { await AsyncStorage.setItem('@sports:theme', t); } catch (e) {}
          }}
        />
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

        {/* Sign Up / Sign In Form */}
        <View style={[styles.formCard, theme === 'light' ? styles.formCardLight : styles.formCardDark]}>
          {showSignIn ? (
            <SignInMobile onSubmit={handleSignIn} onSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpMobile
              onSubmit={handleSignUp}
              onSignInClick={handleSignInClick}
              isLoading={isLoading}
            />
          )}
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
  formCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  formCardDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
});
