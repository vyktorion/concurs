import { motion } from 'framer-motion';
import { Contest } from '@/types/contest';
import { ExternalLink, MapPin, Calendar, Building } from 'lucide-react';
import { Button } from './ui/button';

interface ContestListProps {
  contests: Contest[];
  onOpenModal: (contest: Contest) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function ContestList({ contests, onOpenModal }: ContestListProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <div className="space-y-4">
        {contests.map((contest) => (
          <div
            key={contest._id}
            onClick={() => onOpenModal(contest)}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-2xl shadow hover:shadow-lg transition cursor-pointer border border-white/20 dark:border-gray-700/20"
          >
            <div className="flex items-start space-x-4 w-full md:w-auto">
             <img
  src={contest.logoUrl}
  alt={contest.nume}
  className="w-24 h-24 rounded-2xl object-cover border border-gray-300 dark:border-gray-600 shadow"
/>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{contest.nume}</h3>
                <div className="text-gray-600 dark:text-gray-300 text-sm space-y-1">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(contest.dataDesfasurarii).toLocaleDateString('ro-RO')}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {contest.localitate}, {contest.locatie}
                  </div>
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {contest.adresa}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            onClick={() => onOpenModal(contest)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105"
          >
            Vezi detalii
          </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
