'use client';

import { AuthForm } from '@/components/AuthForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--background)] p-4 text-[var(--foreground)] transition-colors duration-200">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="relative z-10 flex w-full justify-center">
        <AuthForm type="login" />
      </div>
    </div>
  );
}
