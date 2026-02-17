import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';

// Import remote auth components
const RemoteLogin = React.lazy(() => import('authApp/Login'));
const RemoteSignUp = React.lazy(() => import('authApp/SignUp'));

// Import remote UI components  
const RemoteButton = React.lazy(() => import('remoteComponents/Button'));
const RemoteCard = React.lazy(() => import('remoteComponents/Card'));

// Dashboard placeholder
const Dashboard = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
    <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-2xl rounded-3xl overflow-hidden bg-white min-h-[600px]">
      {/* Left Side - Sports Dashboard Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-atomic-tangerine/90 to-peach-glow relative overflow-hidden flex">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          {/* Sports Icon/Illustration */}
          <div className="mb-8">
            <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Trophy Icon */}
              <path d="M60 50 L60 80 Q60 100 80 100 L80 120 L70 120 L70 150 L130 150 L130 120 L120 120 L120 100 Q140 100 140 80 L140 50 Z" fill="white" opacity="0.9" stroke="#FF6B35" strokeWidth="3"/>
              <rect x="50" y="35" width="100" height="20" fill="white" opacity="0.9" stroke="#FF6B35" strokeWidth="3" rx="5"/>
              <rect x="65" y="145" width="70" height="15" fill="white" opacity="0.9" stroke="#FF6B35" strokeWidth="3" rx="3"/>
              <circle cx="100" cy="70" r="15" fill="#FF6B35"/>
              <path d="M95 70 L98 77 L106 77 L99 82 L102 90 L95 85 L88 90 L91 82 L84 77 L92 77 Z" fill="white"/>
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-center">Sports OS Dashboard</h2>
          <p className="text-lg text-center text-white/90 max-w-md mb-8">
            Manage your sports, teams, and events all in one place
          </p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-white/80">Active Teams</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-sm text-white/80">Athletes</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">1K+</div>
              <div className="text-sm text-white/80">Events</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Dashboard Content */}
      <div className="w-full md:w-1/2 p-8 lg:p-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-500 mb-8">Here's what's happening with your sports platform</p>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-atomic-tangerine/10 to-peach-glow/10 rounded-2xl p-6 border-2 border-atomic-tangerine/20">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Quick Actions</h3>
              <p className="text-gray-600 mb-4">Get started with these common tasks</p>
              <div className="space-y-3">
                <button className="w-full bg-atomic-tangerine text-white font-semibold py-3 rounded-full hover:bg-atomic-tangerine/90 transition-all">
                  Create New Event
                </button>
                <button className="w-full border-2 border-atomic-tangerine text-atomic-tangerine font-semibold py-3 rounded-full hover:bg-atomic-tangerine/10 transition-all">
                  Manage Teams
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Remote Components</h3>
              <Suspense fallback={<div className="text-gray-500">Loading components...</div>}>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <RemoteButton />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <RemoteCard />
                  </div>
                </div>
              </Suspense>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button 
                onClick={() => window.location.href = '/login'}
                className="text-atomic-tangerine font-semibold hover:text-peach-glow transition-colors"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-semibold">Loading...</div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<RemoteLogin />} />
          <Route path="/signup" element={<RemoteSignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;