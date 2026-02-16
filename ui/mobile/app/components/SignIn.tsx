import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function SignIn({ onSubmit, onSignUp }) {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    const payload = method === 'email' ? { email, password, method } : { phone, otp, method };
    Promise.resolve(onSubmit ? onSubmit(payload) : null).finally(() => setLoading(false));
  };

  return (
    <View style={{ width: '100%', maxWidth: 420, padding: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#111827' }}>{t('signIn.title')}</Text>

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => setMethod('email')}
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 8,
            backgroundColor: method === 'email' ? '#06b6d4' : 'rgba(0,0,0,0.06)'
          }}
        >
          <Text style={{ color: method === 'email' ? '#fff' : '#374151' }}>📧  {t('signIn.emailOption')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMethod('phone')}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: method === 'phone' ? '#06b6d4' : 'rgba(0,0,0,0.06)'
          }}
        >
          <Text style={{ color: method === 'phone' ? '#fff' : '#374151' }}>📞  {t('signIn.phoneOption')}</Text>
        </TouchableOpacity>
      </View>

      {method === 'email' ? (
        <>
          <TextInput placeholder={t('signIn.email')} placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 10, borderRadius: 8, marginBottom: 8, color: '#111827', backgroundColor: '#fff' }} />
          <TextInput placeholder={t('signIn.password')} placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 10, borderRadius: 8, marginBottom: 12, color: '#111827', backgroundColor: '#fff' }} />
        </>
      ) : (
        <>
          <TextInput placeholder={t('signIn.phone')} placeholderTextColor="#9CA3AF" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 10, borderRadius: 8, marginBottom: 8, color: '#111827', backgroundColor: '#fff' }} />
          <TextInput placeholder={t('signIn.otp')} placeholderTextColor="#9CA3AF" value={otp} onChangeText={setOtp} style={{ borderWidth: 1, borderColor: '#D1D5DB', padding: 10, borderRadius: 8, marginBottom: 12, color: '#111827', backgroundColor: '#fff' }} />
        </>
      )}

      <TouchableOpacity onPress={submit} disabled={loading} style={{ backgroundColor: '#0284c7', padding: 12, borderRadius: 10, alignItems: 'center' }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>{t('signIn.submitButton')}</Text>}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <Text style={{ color: '#6B7280' }}>{t('signIn.noAccount')} </Text>
        <TouchableOpacity onPress={() => { if (onSignUp) onSignUp(); else router.push('/signup'); }}>
          <Text style={{ color: '#0284c7', fontWeight: '600' }}>{t('signIn.signUp')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
