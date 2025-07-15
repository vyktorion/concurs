'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Building } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Contest } from '@/types/contest';

interface ContestCardProps {
  contest: Contest;
  onOpenModal: (contest: Contest) => void;
}

export function ContestCard({ contest, onOpenModal }: ContestCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-2xl transition-all duration-300"
    >
      {/* Logo Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 overflow-hidden">
        {contest.logoUrl ? (
          <Image
            src={contest.logoUrl}
            alt={contest.nume}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-4xl font-bold opacity-80">
              {contest.nume.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {contest.nume}
        </h3>

        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{formatDate(contest.dataDesfasurarii)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span className="text-sm">{contest.localitate}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Building className="h-4 w-4 text-cyan-500" />
            <span className="text-sm line-clamp-1">{contest.locatie}</span>
          </div>

          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{contest.adresa}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => onOpenModal(contest)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105"
          >
            Vezi detalii
          </Button>
        </div>
      </div>
    </motion.div>
  );
}