'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Music2, LogOut, User, Settings, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';

export function DashboardNavbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
            >
              <Music2 className="h-6 w-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DanceContest Pro
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">Dashboard</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Pagina Principală
            </Link>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* User Menu */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {session?.user?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {session?.user?.role === 'admin' ? 'Administrator' : 'Organizator'}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Ieșire
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
              className="rounded-xl"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
          >
            <div className="space-y-4">
              <Link 
                href="/" 
                className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pagina Principală
              </Link>
              
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {session?.user?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {session?.user?.role === 'admin' ? 'Administrator' : 'Organizator'}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Ieșire
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
