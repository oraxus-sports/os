import React, { useState } from 'react';
import SignInShared from '@sports-os/lib/components/SignIn';

export default function SignIn({ onSubmit, onSignUpClick }) {
  // If the shared component is available via the lib package, use it, otherwise
  // fall back to a simple embedded form.
  try {
    return <SignInShared onSubmit={onSubmit} onSignUpClick={onSignUpClick} />;
  } catch (e) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handle = (ev) => {
      ev.preventDefault();
      onSubmit && onSubmit({ email, password, method: 'email' });
    };
    return (
      <form onSubmit={handle} className="space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold">Sign in</h2>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-3 py-2 border rounded" required />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full px-3 py-2 border rounded" required />
        </div>
        <button className="w-full py-2 bg-primary-600 text-white rounded">Sign in</button>
        <div className="text-sm text-center">
          <span>Don't have an account? </span>
          <button type="button" onClick={onSignUpClick} className="text-primary-600">Sign up</button>
        </div>
      </form>
    );
  }
}
