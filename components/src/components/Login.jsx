import React, { useState } from 'react';

const Login = () => {
  const [loginType, setLoginType] = useState('username'); // username, mobile, social
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mobile: '',
    otp: ''
  });
  const [showOTP, setShowOTP] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginType === 'username') {
      console.log('Username login:', { username: formData.username, password: formData.password });
    } else if (loginType === 'mobile') {
      if (!showOTP) {
        setShowOTP(true);
        console.log('Sending OTP to:', formData.mobile);
      } else {
        console.log('Verifying OTP:', { mobile: formData.mobile, otp: formData.otp });
      }
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login initiated`);
    // Add your social login logic here
  };

  const renderUsernameLogin = () => (
    <>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-3">
          Username or Email
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
          placeholder="Enter username or email"
          required
        />
      </div>
      <div className="mb-8">
        <label className="block text-gray-700 text-sm font-semibold mb-3">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90"
          placeholder="Enter password"
          required
        />
      </div>
    </>
  );

  const renderMobileLogin = () => (
    <>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-3">
          Mobile Number
        </label>
        <input
          type="tel"
          name="mobile"
          value={formData.mobile}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90 ${showOTP ? 'opacity-50' : ''}`}
          placeholder="Enter mobile number"
          required
          disabled={showOTP}
        />
      </div>
      {showOTP && (
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-semibold mb-3">
            Enter OTP
          </label>
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:bg-white/90 text-center text-lg tracking-widest"
            placeholder="000000"
            maxLength="6"
            required
          />
          <button
            type="button"
            onClick={() => setShowOTP(false)}
            className="text-blue-600 text-sm mt-3 hover:text-blue-700 transition-colors duration-200 font-medium"
          >
            ← Change mobile number
          </button>
        </div>
      )}
    </>
  );

  const renderSocialLogin = () => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => handleSocialLogin('Google')}
        className="w-full flex items-center justify-center px-6 py-3 bg-white/70 border border-gray-200 rounded-xl shadow-sm hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 backdrop-blur-sm"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
      
      <button
        type="button"
        onClick={() => handleSocialLogin('Facebook')}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Continue with Facebook
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('Twitter')}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl hover:from-black hover:to-gray-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-lg"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        Continue with Twitter
      </button>

      <button
        type="button"
        onClick={() => handleSocialLogin('LinkedIn')}
        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-lg"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        Continue with LinkedIn
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        {/* Login Type Tabs */}
        <div className="flex mb-8 bg-gray-100/50 rounded-xl p-1 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => {
              setLoginType('username');
              setShowOTP(false);
              setFormData({ username: '', password: '', mobile: '', otp: '' });
            }}
            className={`flex-1 py-3 px-4 text-center rounded-lg font-medium text-sm transition-all duration-300 ${
              loginType === 'username'
                ? 'bg-white shadow-lg text-blue-600 scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
            }`}
          >
            Username
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('mobile');
              setShowOTP(false);
              setFormData({ username: '', password: '', mobile: '', otp: '' });
            }}
            className={`flex-1 py-3 px-4 text-center rounded-lg font-medium text-sm transition-all duration-300 ${
              loginType === 'mobile'
                ? 'bg-white shadow-lg text-blue-600 scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
            }`}
          >
            Mobile
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginType('social');
              setShowOTP(false);
              setFormData({ username: '', password: '', mobile: '', otp: '' });
            }}
            className={`flex-1 py-3 px-4 text-center rounded-lg font-medium text-sm transition-all duration-300 ${
              loginType === 'social'
                ? 'bg-white shadow-lg text-blue-600 scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
            }`}
          >
            Social
          </button>
        </div>

      {/* Login Forms */}
      {loginType === 'social' ? (
        renderSocialLogin()
      ) : (
        <form onSubmit={handleSubmit}>
          {loginType === 'username' && renderUsernameLogin()}
          {loginType === 'mobile' && renderMobileLogin()}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {loginType === 'mobile' && !showOTP ? 'Send OTP' : 'Login'}
          </button>
        </form>
      )}

      {/* Additional Links */}
      <div className="mt-8 text-center">
        {loginType === 'username' && (
          <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
            Forgot password?
          </a>
        )}
        <div className="mt-3">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
            Sign up
          </a>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;