'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  LogOut, User, ChevronDown, LayoutDashboard, Menu, X 
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* --- Logo --- */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
            ServerlessFlow
          </span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
          <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>

        {/* --- Auth & Action Section --- */}
        <div className="flex items-center gap-4">
          
          {user ? (
            <>
              {/* Dashboard Link - The Main Hub */}
              <Link href="/dashboard">
                <button className="hidden md:flex items-center gap-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-all">
                  <LayoutDashboard size={16} className="text-indigo-400" />
                  Dashboard
                </button>
              </Link>

              {/* User Dropdown */}
              <div className="relative ml-2">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                    <User size={16} />
                  </div>
                  <span className="font-medium text-sm hidden sm:block max-w-[100px] truncate">
                    {user.username || 'User'}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 z-50">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-xs text-slate-500 uppercase font-bold">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate mt-1">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link href="/dashboard" className="md:hidden block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                        Dashboard
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white">
                        Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white">Log In</Link>
              <Link href="/signup">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all">Get Started</button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-400 hover:text-white ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}