'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, Shield } from 'lucide-react';
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const LOGIN_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`;
  const SIGNUP_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const url = isLogin ? LOGIN_URL : SIGNUP_URL;
    const body = isLogin ? { email, password } : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Success! Redirecting...' });
        if (data.token && data.user) login(data.token, data.user);
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

  const title = isLogin ? 'Welcome back' : 'Create your workspace';
  const subtitle = isLogin
    ? 'Log in to edit functions, deploy endpoints, and review runtime output.'
    : 'Sign up to start building functions, testing payloads, and shipping serverless workflows.';
  const buttonText = isLogin ? 'Log In' : 'Create Account';
  const Icon = isLogin ? LogIn : UserPlus;

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[#e7e6df] bg-white p-8 shadow-[0_24px_60px_rgba(20,20,20,0.08)] sm:p-10">
      <div className="mb-8 flex justify-center">
        <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff5a1f] text-white shadow-[0_14px_28px_rgba(255,90,31,0.22)] transition-transform hover:-translate-y-0.5">
          <Shield size={22} fill="currentColor" />
        </Link>
      </div>

      <h2 className="text-center text-3xl font-semibold tracking-[-0.04em] text-[#181817]">{title}</h2>
      <p className="mt-3 text-center text-sm leading-7 text-[#66665f]">{subtitle}</p>

      {message && (
        <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-[#cdecd9] bg-[#eef8f1] text-[#2e8a57]' : 'border-[#f1d0cb] bg-[#fff2f0] text-[#bf4b3d]'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {!isLogin && (
          <InputField
            Icon={User}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            required
          />
        )}

        <InputField
          Icon={Mail}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          required
        />

        <InputField
          Icon={Lock}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#4f59d9] py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,89,217,0.18)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Icon size={18} />
              {buttonText}
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-[#6a6a63]">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Link href={isLogin ? '/signup' : '/login'} className="font-semibold text-[#3d49d8] hover:text-[#2f3dc9]">
          {isLogin ? 'Sign Up' : 'Log In'}
        </Link>
      </div>
    </div>
  );
}

function InputField({
  Icon,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a83]" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-[#e2e1da] bg-[#fbfbf8] py-3.5 pl-12 pr-4 text-[#181817] placeholder:text-[#8c8c85] focus:border-[#4f59d9] focus:outline-none focus:ring-2 focus:ring-[#d9dcff]"
      />
    </div>
  );
}
