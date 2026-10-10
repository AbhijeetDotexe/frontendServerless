'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, LogIn, UserPlus, Shield, Loader2 } from 'lucide-react';
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
    <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl sm:p-10 transition-colors">
      <div className="mb-6 flex justify-center">
        <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--foreground)] text-[var(--background)] shadow-sm transition-opacity hover:opacity-90">
          <Shield size={20} fill="currentColor" />
        </Link>
      </div>

      <h2 className="text-center text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{title}</h2>
      <p className="mt-2 text-center text-xs leading-5 text-[var(--muted)]">{subtitle}</p>

      {message && (
        <div className={`mt-5 rounded-xl border px-4 py-2.5 text-xs font-medium ${
          message.type === 'success' 
            ? 'border-[#2f9e44]/30 bg-[#ebfbee] dark:bg-[#132b1b] text-[#2f9e44] dark:text-[#40c057]' 
            : 'border-[#e03131]/30 bg-[#fff5f5] dark:bg-[#341717] text-[#e03131] dark:text-[#fa5252]'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3b5bdb] py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#3451c7] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Icon size={16} />
              {buttonText}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-[var(--muted)]">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Link href={isLogin ? '/signup' : '/login'} className="font-semibold text-[#3b5bdb] dark:text-[#748ffc] hover:underline">
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
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-2)]" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-3.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-2)] outline-none focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 transition-colors"
      />
    </div>
  );
}
