'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Shield, User, X } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[#e8e7e1] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff5a1f] text-white shadow-[0_14px_28px_rgba(255,90,31,0.22)]">
            <Shield size={20} fill="currentColor" />
          </div>
          <div>
            <span className="block text-xl font-semibold tracking-[-0.03em] text-[#181817]">ServerlessFlow</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-[#7a7a73]">Function workspace</span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-[#4f4f49] md:flex">
          <Link href="/" className="transition-colors hover:text-[#181817]">Product</Link>
          <Link href="/docs" className="transition-colors hover:text-[#181817]">Docs</Link>
          <Link href="/dashboard" className="transition-colors hover:text-[#181817]">Dashboard</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden items-center gap-2 rounded-full bg-[#4f59d9] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,89,217,0.18)] transition-transform hover:-translate-y-0.5 md:flex"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <div className="relative ml-1">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="flex items-center gap-2 text-[#4f4f49] transition-colors hover:text-[#181817] focus:outline-none"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e0dfd8] bg-[#f7f7f3] text-[#6a6a63]">
                    <User size={16} />
                  </div>
                  <span className="hidden max-w-[120px] truncate text-sm font-semibold sm:block">
                    {user.username || 'User'}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-60 rounded-[1.4rem] border border-[#e6e5de] bg-white py-1 shadow-[0_24px_60px_rgba(20,20,20,0.08)]">
                    <div className="border-b border-[#efeee8] px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7d7d75]">Signed in as</p>
                      <p className="mt-1 truncate text-sm font-medium text-[#181817]">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-[#4f4f49] hover:bg-[#f7f7f3] hover:text-[#181817] md:hidden">
                        Dashboard
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-[#4f4f49] hover:bg-[#f7f7f3] hover:text-[#181817]">
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-[#efeee8] pt-1">
                      <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-[#bf4b3d] hover:bg-[#f7f7f3]">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-semibold text-[#4f4f49] hover:text-[#181817] md:block">
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[#4f59d9] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,89,217,0.18)] transition-transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          )}

          <button className="ml-1 text-[#4f4f49] hover:text-[#181817] md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#ecebe5] bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium text-[#4f4f49]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Product</Link>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            {!user && <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}
