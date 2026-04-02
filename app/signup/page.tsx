'use client';

import { AuthForm } from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#f5f5f2] p-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[linear-gradient(180deg,#ffffff_0%,#f8f8f5_68%,#f5f5f2_100%)]" />
      <div className="pointer-events-none absolute right-[-8rem] top-16 h-64 w-64 rounded-full bg-[#ff5a1f]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-8rem] bottom-8 h-72 w-72 rounded-full bg-[#dddcd5] blur-3xl" />
      <div className="relative z-10 flex w-full justify-center">
        <AuthForm type="signup" />
      </div>
    </div>
  );
}
