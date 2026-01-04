'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

type FormType = 'login' | 'signup';

interface AuthFormProps {
  type: FormType;
}

export function AuthForm({ type }: AuthFormProps) {
  const { login } = useAuth();
  const isLogin = type === 'login';
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Exact endpoints
  const LOGIN_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`;
  const SIGNUP_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const url = isLogin ? LOGIN_URL : SIGNUP_URL;
    
    const body = isLogin 
      ? { email, password }
      : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Success! Redirecting...' });
        
        // If login is successful, update Global State via Context
        if (data.token && data.user) {
          login(data.token, data.user);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Action failed.' });
      }

    } catch (error) {
      console.error('Auth Error:', error);
      setMessage({ type: 'error', text: 'Server connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  const title = isLogin ? 'Welcome Back!' : 'Create Account';
  const buttonText = isLogin ? 'Log In' : 'Sign Up';
  const Icon = isLogin ? LogIn : UserPlus;

  // --- This is the JSX Return Block that was missing/hidden ---
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-2xl border border-indigo-700/50 w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-indigo-500/30">
      
      <div className="flex justify-center mb-6">
         <Link href="/">
           <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <span className="font-bold text-white text-xl">S</span>
           </div>
         </Link>
      </div>

      <h2 className="text-3xl font-extrabold text-white mb-2 text-center">{title}</h2>
      <p className="text-sm text-slate-400 mb-8 text-center">
        {isLogin ? 'Access your workspace.' : 'Join ServerlessFlow today.'}
      </p>

      {message && (
        <div className={`p-3 rounded-lg text-sm mb-5 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {!isLogin && (
          <InputField 
            Icon={User}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
            required
          />
        )}

        <InputField 
          Icon={Mail}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          required
        />

        <InputField 
          Icon={Lock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/40"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <>
              <Icon size={20} />
              {buttonText}
            </>
          )}
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm text-slate-500">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link href={isLogin ? '/signup' : '/login'} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          {isLogin ? 'Sign Up' : 'Log In'}
        </Link>
      </div>
    </div>
  );
}

// Reusable Input Component
const InputField = ({ Icon, type, placeholder, value, onChange, required }: any) => (
  <div className="relative">
    <Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-slate-800 text-white placeholder-slate-500 pl-11 pr-4 py-3 border border-slate-700 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
    />
  </div>
);