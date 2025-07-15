'use client';

import { motion } from 'framer-motion';
import { Music2, Heart, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo și descriere */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
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
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Platforma profesională pentru organizarea și promovarea concursurilor de dans din România. 
              Conectăm dansatorii cu cele mai importante evenimente.
            </p>
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <span>Făcut cu</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>pentru comunitatea de dans</span>
            </div>
          </div>

          {/* Link-uri rapide */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Link-uri rapide</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Acasă
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Conectare
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Înregistrare
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contact@dancecontest.ro</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+40 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>București, România</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2025 DanceContest Pro. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}