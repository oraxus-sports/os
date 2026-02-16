import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone } from 'lucide-react';

export interface SignInData {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface SignInProps {
  onSubmit: (data: SignInData & { method: 'email' | 'phone' }) => void;
  onSignUpClick?: () => void;
  isLoading?: boolean;
}

export const SignIn: React.FC<SignInProps> = ({ onSubmit, onSignUpClick, isLoading = false }) => {
  const { t } = useTranslation('auth');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (method === 'email') {
      onSubmit({ email, password, method });
    } else {
      onSubmit({ phone, otp, method });
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('signIn.title') || 'Sign in'}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('signIn.subtitle') || 'Welcome back — sign in to continue'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3" role="tablist" aria-label="Sign in method">
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={
              method === 'email'
                ? 'flex items-center gap-2 px-4 py-2 rounded-md bg-primary-600 text-white'
                : 'flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white border'
            }
            aria-pressed={method === 'email'}
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span>{t('signIn.emailOption') || 'Email'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={
              method === 'phone'
                ? 'flex items-center gap-2 px-4 py-2 rounded-md bg-primary-600 text-white'
                : 'flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white border'
            }
            aria-pressed={method === 'phone'}
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>{t('signIn.phoneOption') || 'Phone'}</span>
          </button>
        </div>

        {method === 'email' ? (
          <>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('signIn.email') || 'Email'}</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-4 py-3 rounded-lg border mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('signIn.password') || 'Password'}</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 rounded-lg border mt-1" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('signIn.phone') || 'Phone'}</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required className="w-full px-4 py-3 rounded-lg border mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('signIn.otp') || 'OTP'}</label>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" className="w-full px-4 py-3 rounded-lg border mt-1" />
            </div>
          </>
        )}

        <button type="submit" disabled={isLoading} className="w-full py-3 rounded-lg bg-primary-600 text-white">
          {isLoading ? 'Loading…' : t('signIn.submitButton') || 'Sign in'}
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">{t('signIn.noAccount') || "Don't have an account?"}{' '}</span>
        <button onClick={onSignUpClick} className="text-primary-600 font-medium">{t('signIn.signUp') || 'Sign up'}</button>
      </div>
    </div>
  );
};

export default SignIn;
