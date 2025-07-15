'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Music2, Sparkles, LayoutGrid, List } from 'lucide-react';
import { ContestCard } from '@/components/contest-card';
import { ContestList } from '@/components/contest-list';
import { ContestModal } from '@/components/contest-modal';
import { LocationFilter } from '@/components/location-filter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Contest } from '@/types/contest';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    filterContests();
  }, [contests, searchTerm, selectedLocation]);

  const fetchContests = async () => {
    try {
      const response = await fetch('/api/contests');
      if (response.ok) {
        const data = await response.json();
        setContests(data);
      } else {
        setContests([]);
      }
    } catch (error) {
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const filterContests = () => {
    let filtered = contests;

    if (selectedLocation) {
      filtered = filtered.filter(contest => contest.localitate === selectedLocation);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(contest =>
        contest.localitate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contest.nume.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContests(filtered);
  };

  const handleOpenModal = (contest: Contest) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContest(null);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
            <div className="flex justify-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl">
                <Music2 className="h-12 w-12 text-white" />
              </motion.div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Concursuri de Dans
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Descoperă cele mai importante concursuri de dans din România. 
              Găsește evenimente în orașul tău și participă la competiții de nivel profesionist.
            </p>

          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Music2, label: 'Concursuri Active', value: contests.length },
              { icon: Sparkles, label: 'Organizatori', value: new Set(contests.map(c => c.organizatorId)).size },
              { icon: Sparkles, label: 'Localități', value: new Set(contests.map(c => c.localitate)).size }
            ].map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }} className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Filter */}
      {!loading && contests.length > 0 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <LocationFilter
              contests={contests}
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
            />
          </div>
        </section>
      )}

      {/* Contests Section */}
      <section className="py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          
            {/* View Mode Switcher */}
            <div className="flex justify-left mb-8 ml-2 space-x-4 hidden lg:flex">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')} size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} size="icon">
                <List className="h-4 w-4" />
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="inline-block p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                  <Music2 className="h-8 w-8 text-white" />
                </motion.div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Se încarcă concursurile...</p>
              </div>
            ) : filteredContests.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 max-w-md mx-auto">
                  <Music2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {searchTerm || selectedLocation ? 'Nu am găsit concursuri' : 'Nu există concursuri'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm || selectedLocation
                      ? 'Încearcă să cauți cu alți termeni sau selectează altă localitate.'
                      : 'Momentan nu există concursuri disponibile.'}
                  </p>
                </div>
              </motion.div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredContests.map((contest, index) => (
                    <motion.div
                      key={contest._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <ContestCard contest={contest} onOpenModal={handleOpenModal} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <ContestList contests={filteredContests} onOpenModal={handleOpenModal} />
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      <Footer />


      <ContestModal contest={selectedContest} isOpen={isModalOpen} onClose={handleCloseModal} />
   
    </div>
  );
}
