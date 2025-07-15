'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Edit, 
  Trash2, 
  Eye,
  Music2,
  Users,
  TrendingUp,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Contest } from '@/types/contest';
import { ContestModal } from '@/components/contest-modal';
import { ContestForm } from '@/components/contest-form';
import { DashboardNavbar } from '@/components/dashboard-navbar';
import { Footer } from '@/components/ui/footer';


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Toți utilizatorii autentificați pot accesa dashboard-ul
    console.log('✅ User authenticated, accessing dashboard:', session.user);
    
    fetchUserContests();
  }, [session, status, router]);

  const fetchUserContests = async () => {
    try {
      console.log('🔄 Fetching user contests from database...');
      const response = await fetch('/api/contests');
      if (response.ok) {
        const data = await response.json();
        console.log('📊 All contests from database:', data.length);
        
        // Admin vede toate concursurile, alții doar pe ale lor
        const userRole = session?.user?.role || 'user';
        if (userRole === 'admin') {
          console.log('👑 Admin - showing all contests:', data.length);
          setContests(data);
        } else {
          // Filtrăm concursurile pentru utilizatorul curent
          const userContests = data.filter((contest: Contest) => 
            contest.organizatorId === session?.user?.id
          );
          console.log('👤 User contests:', userContests.length);
          setContests(userContests);
        }
      } else {
        console.error('❌ Failed to fetch contests from database');
        setContests([]);
      }
    } catch (error) {
      console.error('❌ Error fetching contests from database:', error);
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContest = () => {
    setEditingContest(null);
    setIsFormOpen(true);
  };

  const handleEditContest = (contest: Contest) => {
    setEditingContest(contest);
    setIsFormOpen(true);
  };

  const handleDeleteContest = async (contestId: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest concurs?')) return;
    
    try {
      // Simulăm ștergerea
      setContests(contests.filter(c => c._id !== contestId));
    } catch (error) {
      console.error('Error deleting contest:', error);
    }
  };

  const handleViewContest = (contest: Contest) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"
        >
          <Music2 className="h-8 w-8 text-white" />
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <DashboardNavbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Dashboard Organizator
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Bun venit, {session.user?.name}! Gestionează-ți concursurile aici.
                </p>
              </div>
              <Button
                onClick={handleCreateContest}
                className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Concurs Nou
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { 
                title: 'Total Concursuri', 
                value: contests.length, 
                icon: Music2, 
                color: 'from-blue-500 to-blue-600' 
              },
              { 
                title: 'Active', 
                value: contests.filter(c => c.activ).length, 
                icon: TrendingUp, 
                color: 'from-green-500 to-green-600' 
              },
              { 
                title: 'Localități', 
                value: new Set(contests.map(c => c.localitate)).size, 
                icon: MapPin, 
                color: 'from-purple-500 to-purple-600' 
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                      </div>
                      <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-2xl`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contests List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Concursurile Tale
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"
                    >
                      <Music2 className="h-6 w-6 text-white" />
                    </motion.div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Se încarcă concursurile...</p>
                  </div>
                ) : contests.length === 0 ? (
                  <div className="text-center py-12">
                    <Music2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Nu ai concursuri încă
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Listeaza primul tău concurs.
                    </p>
                    <Button
                      onClick={handleCreateContest}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 py-3 font-semibold"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Creează primul concurs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contests.map((contest, index) => (
                      <motion.div
                        key={contest._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="mr-4">
                            {contest.logoUrl && (
                              <img 
                                src={contest.logoUrl} 
                                alt={contest.nume} 
                                className="h-14 w-14 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                              />
                            )}
                              </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {contest.nume}
                              </h3>
                              <Badge variant={contest.activ ? "default" : "secondary"}>
                                {contest.activ ? "Activ" : "Inactiv"}
                              </Badge>
                              {session?.user?.role === 'admin' && contest.organizatorId !== session.user.id && (
                                <Badge variant="outline" className="text-xs">
                                  Alt org
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-6 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(contest.dataDesfasurarii)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>{contest.localitate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            <Button
                              onClick={() => handleViewContest(contest)}
                              variant="outline"
                              size="sm"
                              className="rounded-lg"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleEditContest(contest)}
                              variant="outline"
                              size="sm"
                              className="rounded-lg"
                              disabled={session?.user?.role !== 'admin' && contest.organizatorId !== session?.user?.id}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteContest(contest._id)}
                              variant="outline"
                              size="sm"
                              className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              disabled={session?.user?.role !== 'admin' && contest.organizatorId !== session?.user?.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <ContestModal
        contest={selectedContest}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedContest(null);
        }}
      />

      <ContestForm
        contest={editingContest}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingContest(null);
        }}
        onSuccess={() => {
          fetchUserContests();
          setIsFormOpen(false);
          setEditingContest(null);
        }}
      />
      
  <Footer />
    </div>
  );
}
