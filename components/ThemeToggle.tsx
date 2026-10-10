'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle color theme"
      className={`flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors ${className}`}
    >
      {theme === 'dark' ? (
        <Sun size={14} className="text-amber-300 hover:text-amber-200 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon size={14} className="text-zinc-600 hover:text-zinc-900 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
}
