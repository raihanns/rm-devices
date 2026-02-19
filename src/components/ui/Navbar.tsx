'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [supabase.auth]);

  useEffect(() => {
    // Cleanup subscription
      return () => {
        // Subscription cleanup handled by Supabase
      };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <span className="text-white font-bold text-base">RM</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
              RM Devices
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200"
            >
              Catalog
            </Link>
            <Link
              href="/testimonials"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200"
            >
              Testimonials
            </Link>
            
            {isLoading ? (
              <div className="w-20 h-9 ml-2 rounded-lg skeleton" />
            ) : isLoggedIn ? (
              <div className="flex items-center space-x-2 ml-2">
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/admin"
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'
        }`}>
          <div className="glass rounded-2xl p-3 space-y-1">
            <Link
              href="/"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Catalog
            </Link>
            <Link
              href="/testimonials"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            
            {isLoading ? (
              <div className="h-10 rounded-xl skeleton mx-2" />
            ) : isLoggedIn ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-md transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/admin"
                className="block px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 rounded-xl shadow-md transition-all duration-200 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
