import { useState } from 'react';
import { SignUp } from '~/components/SignUp';
import SignIn from '~/components/SignIn';
import auth from '@sports-os/lib/services/auth';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import ThemeSelector from '~/components/ThemeSelector';

// Use shared background from lib/assets
// prefer the shared placeholder; copy a JPG/PNG into `web/src/assets` using the copy script
import sportsBackground from '~/assets/sports-background.jpg';

function App() {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignUp = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = { username: data.username || data.email, password: data.password, email: data.email, phoneNumber: data.phone };
      const res = await auth.register(payload as any);
      setIsLoading(false);
      if (res && res.success) {
        alert('Account created — please sign in');
        setShowSignIn(true);
      } else {
        alert('Registration failed: ' + (res?.message || JSON.stringify(res)));
      }
    } catch (e: any) {
      setIsLoading(false);
      alert('Registration error: ' + (e?.message || e));
    }
  };

  const handleSignInClick = () => setShowSignIn(true);

  const handleSignIn = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = { username: data.email || data.phone, password: data.password, platform: 'web' };
      const res = await auth.login(payload as any);
      setIsLoading(false);
      if (res && res.success) {
        alert('Signed in');
      } else if (res && res.session) {
        // handle challenge if required
        alert('Additional challenge required: ' + (res.challengeName || ''));
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
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${sportsBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm" />
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg p-2">
          <Globe className="w-4 h-4 text-white" aria-hidden="true" />
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue="en"
            className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
            aria-label="Select language"
          >
            <option value="en" className="text-gray-900">English</option>
            <option value="ta" className="text-gray-900">தமிழ்</option>
            <option value="te" className="text-gray-900">తెలుగు</option>
            <option value="hi" className="text-gray-900">हिन्दी</option>
          </select>
          <ThemeSelector />
        </div>
      </div>

      {/* Sign Up Form Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10">
          {showSignIn ? (
            <SignIn onSubmit={handleSignIn} onSignUpClick={() => setShowSignIn(false)} isLoading={isLoading} />
          ) : (
            <SignUp 
              onSubmit={handleSignUp}
              onSignInClick={handleSignInClick}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
