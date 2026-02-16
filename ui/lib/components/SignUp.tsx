import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, User, LogIn } from 'lucide-react';
import { clsx } from 'clsx';

// Validation schema
const signUpSchema = z.object({
  name: z.string().min(1, 'nameRequired'),
  email: z.string().email('emailInvalid').min(1, 'emailRequired'),
  phone: z.string().regex(/^[0-9]{10}$/, 'phoneInvalid').min(1, 'phoneRequired'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export interface SignUpProps {
  onSubmit: (data: SignUpFormData & { signInMethod: 'email' | 'phone' }) => void;
  onSignInClick?: () => void;
  isLoading?: boolean;
}

export const SignUp: React.FC<SignUpProps> = ({ onSubmit, onSignInClick, isLoading = false }) => {
  const { t } = useTranslation('auth');
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onFormSubmit = (data: SignUpFormData) => {
    onSubmit({ ...data, signInMethod });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          {t('signUp.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('signUp.subtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        {/* Name Field */}
        <div className="space-y-2">
          <label 
            htmlFor="name" 
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <User className="w-4 h-4" aria-hidden="true" />
            {t('signUp.name')}
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            placeholder={t('signUp.namePlaceholder')}
            className={clsx(
              'w-full px-4 py-3 rounded-lg border transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
              errors.name ? 'border-red-500' : 'border-gray-300'
            )}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {t(`signUp.errors.${errors.name.message}`)}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label 
            htmlFor="email" 
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            {t('signUp.email')}
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder={t('signUp.emailPlaceholder')}
            className={clsx(
              'w-full px-4 py-3 rounded-lg border transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
              errors.email ? 'border-red-500' : 'border-gray-300'
            )}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {t(`signUp.errors.${errors.email.message}`)}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-2">
          <label 
            htmlFor="phone" 
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            {t('signUp.phone')}
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder={t('signUp.phonePlaceholder')}
            className={clsx(
              'w-full px-4 py-3 rounded-lg border transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
              errors.phone ? 'border-red-500' : 'border-gray-300'
            )}
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-sm text-red-600 dark:text-red-400" role="alert">
              {t(`signUp.errors.${errors.phone.message}`)}
            </p>
          )}
        </div>

        {/* Sign In Method Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('signUp.signInWith')}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSignInMethod('email')}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                signInMethod === 'email'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white border'
              )}
              aria-pressed={signInMethod === 'email'}
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              <span>{t('signUp.emailOption')}</span>
            </button>
            <button
              type="button"
              onClick={() => setSignInMethod('phone')}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                signInMethod === 'phone'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white border'
              )}
              aria-pressed={signInMethod === 'phone'}
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              <span>{t('signUp.phoneOption')}</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg',
            'bg-primary-600 hover:bg-primary-700 text-white font-medium',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-label="Loading" />
          ) : (
            <>
              <LogIn className="w-5 h-5" aria-hidden="true" />
              {t('signUp.submitButton')}
            </>
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="text-center text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {t('signUp.alreadyHaveAccount')}{' '}
        </span>
        <button
          onClick={onSignInClick}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium focus:outline-none focus:underline"
        >
          {t('signUp.signIn')}
        </button>
      </div>
    </div>
  );
};
