'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Music2, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from './button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
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
              className="text-gray-700 dark:text-gray-300 font-medium cursor-pointer"
            >
              Acasă
            </Link>

            {session ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-gray-700 dark:text-gray-300 cursor-pointer">
                      Contul meu
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-md rounded-md px-2 py-1 space-y-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-2 py-1 text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center w-full px-2 py-1 text-red-500 dark:text-red-500 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Ieșire
                      </button>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 dark:text-gray-300 cursor-pointer"
                >
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
              className="text-gray-700 dark:text-gray-300 cursor-pointer"
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
                className="text-gray-700 dark:text-gray-300 font-medium px-2 py-1 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Acasă
              </Link>

              {session ? (
                <>
                  <div className="flex justify-center">
                  <Link
               href="/dashboard"
               className="flex items-center text-gray-700 dark:text-gray-300 font-medium px-2 py-1 cursor-pointer"
               onClick={() => setIsOpen(false)}
                 >
                   <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                   </div>
                  <Button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                variant="outline"
                size="sm"
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
               >
                    <LogOut className="h-4 w-4 mr-2" />
                    Ieșire
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    className="justify-start text-gray-700 dark:text-gray-300 px-2 cursor-pointer"
                  >
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
