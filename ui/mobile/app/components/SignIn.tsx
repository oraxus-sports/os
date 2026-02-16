import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignIn({ onSubmit, onSignUp }) {
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
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#fff' }}>Sign in</Text>

      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => setMethod('email')}
          style={{
            marginRight: 8,
            padding: 8,
            borderRadius: 8,
            backgroundColor: method === 'email' ? '#06b6d4' : 'rgba(255,255,255,0.08)'
          }}
        >
          <Text style={{ color: '#fff' }}>📧  Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMethod('phone')}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: method === 'phone' ? '#06b6d4' : 'rgba(255,255,255,0.08)'
          }}
        >
          <Text style={{ color: '#fff' }}>📞  Phone</Text>
        </TouchableOpacity>
      </View>

      {method === 'email' ? (
        <>
          <TextInput placeholder="Email" placeholderTextColor="#ddd" value={email} onChangeText={setEmail} keyboardType="email-address" style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 10, borderRadius: 8, marginBottom: 8, color: '#fff' }} />
          <TextInput placeholder="Password" placeholderTextColor="#ddd" value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 10, borderRadius: 8, marginBottom: 12, color: '#fff' }} />
        </>
      ) : (
        <>
          <TextInput placeholder="Phone" placeholderTextColor="#ddd" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 10, borderRadius: 8, marginBottom: 8, color: '#fff' }} />
          <TextInput placeholder="OTP (optional)" placeholderTextColor="#ddd" value={otp} onChangeText={setOtp} style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', padding: 10, borderRadius: 8, marginBottom: 12, color: '#fff' }} />
        </>
      )}

      <TouchableOpacity onPress={submit} disabled={loading} style={{ backgroundColor: '#06b6d4', padding: 12, borderRadius: 10, alignItems: 'center' }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: '600' }}>Sign in</Text>}
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
        <Text style={{ color: '#ddd' }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => { if (onSignUp) onSignUp(); else router.push('/signup'); }}>
          <Text style={{ color: '#06b6d4', fontWeight: '600' }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
