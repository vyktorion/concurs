'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Menu, X, User, LogIn } from 'lucide-react';
import { Button } from './button';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
            >
              <Music2 className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DanceContest Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Acasă
            </Link>
            
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Button
                  onClick={() => signOut()}
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <User className="h-4 w-4 mr-2" />
                  Ieșire
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <LogIn className="h-4 w-4 mr-2" />
                  Conectare
                </Button>
              </Link>
            )}
            
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200/20 dark:border-gray-700/20"
          >
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-2 py-1"
                onClick={() => setIsOpen(false)}
              >
                Acasă
              </Link>
              
              {session ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    variant="ghost"
                    className="justify-start text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Ieșire
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="justify-start text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-2">
                    <LogIn className="h-4 w-4 mr-2" />
                    Conectare
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}