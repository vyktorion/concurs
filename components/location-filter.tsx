'use client';

import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Contest } from '@/types/contest';
import { Search, Music2, Sparkles, LayoutGrid, List } from 'lucide-react';
import { useState, useEffect } from 'react';



interface LocationFilterProps {
  contests: Contest[];
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export function LocationFilter({ contests, selectedLocation, onLocationChange }: LocationFilterProps) {
  // Calculăm numărul de concursuri pentru fiecare localitate
  const locationCounts = contests.reduce((acc, contest) => {
    acc[contest.localitate] = (acc[contest.localitate] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Sortăm localitățile alfabetic
  const locations = Object.keys(locationCounts).sort();

  // Calculăm totalul pentru "Toate"
  const totalContests = contests.length;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center gap-3 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20"
    >

      {/* Iconița de filtru */}
      <div className="flex items-center space-x-2 mr-2">
        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300 font-medium">Filtrează </span>
      </div>

      {/* Butonul "Toate" */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => onLocationChange('')}
          variant={selectedLocation === '' ? 'default' : 'outline'}
          className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
            selectedLocation === ''
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          Toate ({totalContests})
        </Button>
      </motion.div>

      {/* Butoanele pentru fiecare localitate */}
      {locations.map((location, index) => (
        <motion.div
          key={location}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => onLocationChange(location)}
            variant={selectedLocation === location ? 'default' : 'outline'}
            className={`rounded-full px-4 py-2 font-medium transition-all duration-300 ${
              selectedLocation === location
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600'
                : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
          >
            {location} ({locationCounts[location]})
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
