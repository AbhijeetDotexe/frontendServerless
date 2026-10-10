'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Shield, User, X } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex max-w-full items-center justify-between gap-4 px-5 h-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--foreground)] text-[var(--background)]">
            <Shield size={14} fill="currentColor" />
          </div>
          <span className="text-sm font-semibold tracking-[-0.02em] text-[var(--foreground)]">ServerlessFlow</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
          <Link href="/" className="transition-colors hover:text-[var(--foreground)]">Product</Link>
          <Link href="/docs" className="transition-colors hover:text-[var(--foreground)]">Docs</Link>
          <Link href="/dashboard" className="transition-colors hover:text-[var(--foreground)]">Dashboard</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden items-center gap-1.5 rounded-lg bg-[#3b5bdb] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3451c7] md:flex"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="flex items-center gap-1.5 text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus:outline-none"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]">
                    <User size={13} />
                  </div>
                  <span className="hidden max-w-[100px] truncate text-xs font-medium sm:block text-[var(--foreground)]">
                    {user.username || 'User'}
                  </span>
                  <ChevronDown size={12} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                    <div className="border-b border-[var(--border)] px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-2)]">Signed in as</p>
                      <p className="mt-0.5 truncate text-xs font-medium text-[var(--foreground)]">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard" className="block px-4 py-2 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] md:hidden">
                        Dashboard
                      </Link>
                      <Link href="/editor" className="block px-4 py-2 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]">
                        Workspace
                      </Link>
                    </div>
                    <div className="border-t border-[var(--border)] pt-1">
                      <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-[#e03131] hover:bg-[#fff5f5] dark:hover:bg-[#341717]">
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] md:block">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[var(--foreground)] px-3 py-1.5 text-xs font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          )}

          <button className="ml-1 text-[var(--muted)] hover:text-[var(--foreground)] md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-[var(--muted)]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Product</Link>
            <Link href="/docs" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            {!user && <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>}
          </div>
        </div>
      )}
    </nav>
  );
}
