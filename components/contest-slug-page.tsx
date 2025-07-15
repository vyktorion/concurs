'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ContestModal } from './contest-modal';
import { Contest } from '@/types/contest';

interface ContestSlugPageProps {
  contest: Contest;
}

export default function ContestSlugPage({ contest }: ContestSlugPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Prevenim dubla deschidere cu un mic delay
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      router.push('/');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
      <ContestModal
        contest={contest}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}