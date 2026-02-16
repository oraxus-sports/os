import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

// Validation schema
const signUpSchema = z.object({
  name: z.string().min(1, 'nameRequired'),
  email: z.string().email('emailInvalid').min(1, 'emailRequired'),
  phone: z.string().regex(/^[0-9]{10}$/, 'phoneInvalid').min(1, 'phoneRequired'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export interface SignUpMobileProps {
  onSubmit: (data: SignUpFormData & { signInMethod: 'email' | 'phone' }) => void;
  onSignInClick?: () => void;
  isLoading?: boolean;
}

export const SignUpMobile: React.FC<SignUpMobileProps> = ({ 
  onSubmit, 
  onSignInClick, 
  isLoading = false 
}) => {
  const { t } = useTranslation('auth');
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onFormSubmit = (data: SignUpFormData) => {
    onSubmit({ ...data, signInMethod });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{t('signUp.title')}</Text>
        <Text style={styles.subtitle}>{t('signUp.subtitle')}</Text>
      </View>

      {/* Name Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>👤 {t('signUp.name')}</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('signUp.namePlaceholder')}
              placeholderTextColor="#9CA3AF"
              accessibilityLabel={t('signUp.name')}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>
            {t(`signUp.errors.${errors.name.message}`)}
          </Text>
        )}
      </View>

      {/* Email Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>📧 {t('signUp.email')}</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('signUp.emailPlaceholder')}
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel={t('signUp.email')}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>
            {t(`signUp.errors.${errors.email.message}`)}
          </Text>
        )}
      </View>

      {/* Phone Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>📱 {t('signUp.phone')}</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={t('signUp.phonePlaceholder')}
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              accessibilityLabel={t('signUp.phone')}
            />
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>
            {t(`signUp.errors.${errors.phone.message}`)}
          </Text>
        )}
      </View>

      {/* Sign In Method Toggle */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{t('signUp.signInWith')}</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setSignInMethod('email')}
            style={[
              styles.toggleButton,
              signInMethod === 'email' && styles.toggleButtonActive
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: signInMethod === 'email' }}
          >
            <Text style={[
              styles.toggleText,
              signInMethod === 'email' && styles.toggleTextActive
            ]}>
              📧 {t('signUp.emailOption')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setSignInMethod('phone')}
            style={[
              styles.toggleButton,
              signInMethod === 'phone' && styles.toggleButtonActive
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: signInMethod === 'phone' }}
          >
            <Text style={[
              styles.toggleText,
              signInMethod === 'phone' && styles.toggleTextActive
            ]}>
              📱 {t('signUp.phoneOption')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit(onFormSubmit)}
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel={t('signUp.submitButton')}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>
            🚀 {t('signUp.submitButton')}
          </Text>
        )}
      </TouchableOpacity>

      {/* Sign In Link */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>{t('signUp.alreadyHaveAccount')} </Text>
        <TouchableOpacity onPress={onSignInClick} accessibilityRole="button">
          <Text style={styles.signInLink}>{t('signUp.signIn')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    borderColor: '#0284c7',
    backgroundColor: '#E0F2FE',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#0369a1',
  },
  submitButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 56,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signInLink: {
    fontSize: 14,
    color: '#0284c7',
    fontWeight: '600',
  },
});
