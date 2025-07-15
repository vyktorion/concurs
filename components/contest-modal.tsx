'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Building, Globe, ExternalLink } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Button } from './ui/button';
import Image from 'next/image';
import { Contest } from '@/types/contest';

interface ContestModalProps {
  contest: Contest | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContestModal({ contest, isOpen, onClose }: ContestModalProps) {
  if (!contest) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white/90 dark:hover:bg-gray-700/90 rounded-2xl p-3"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="flex flex-col lg:flex-row">
              {/* Left Section - Image */}
              <div className="lg:w-1/2 relative h-64 lg:h-auto bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500">
                {contest.logoUrl ? (
                  <Image
                    src={contest.logoUrl}
                    alt={contest.nume}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-6xl font-bold opacity-80">
                      {contest.nume.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Right Section - Content */}
              <div className="lg:w-1/2 p-8 overflow-y-auto max-h-[calc(90vh-2rem)]">
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {contest.nume}
                    </h2>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Data desfășurării</p>
                        <p className="text-blue-600 dark:text-blue-400">{formatDate(contest.dataDesfasurarii)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Localitate</p>
                        <p className="text-purple-600 dark:text-purple-400">{contest.localitate}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl">
                      <Building className="h-5 w-5 text-cyan-600" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">Locația</p>
                        <p className="text-cyan-600 dark:text-cyan-400">{contest.locatie}</p>
                      </div>
                    </div>
                  </div>

                    {/* Address */}
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                         <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Adresa </p>
                        <p className="text-gray-600 dark:text-gray-400">{contest.adresa}</p>
                      </div>
                    </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Despre concurs</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                      {contest.descriere}
                    </p>
                  </div>

                  {/* Links */}
                  <div className="space-y-4">
                    {contest.linkSiteOficial && (
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl py-3 font-semibold"
                      >
                        <a href={contest.linkSiteOficial} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Vizitează site-ul oficial
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}

                    {/* Social Media */}
                    {(contest.socialMedia?.facebook || contest.socialMedia?.instagram || contest.socialMedia?.tiktok) && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Urmărește-ne</h4>
                        <div className="flex space-x-3">
                          {contest.socialMedia?.facebook && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={contest.socialMedia.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-colors"
                            >
                              <FaFacebook className="h-5 w-5" />
                            </motion.a>
                          )}
                          {contest.socialMedia?.instagram && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={contest.socialMedia.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl transition-colors"
                            >
                              <FaInstagram className="h-5 w-5" />
                            </motion.a>
                          )}
                          {contest.socialMedia?.tiktok && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              href={contest.socialMedia.tiktok}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-black hover:bg-gray-800 text-white rounded-2xl transition-colors"
                            >
                              <FaTiktok className="h-5 w-5" />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
