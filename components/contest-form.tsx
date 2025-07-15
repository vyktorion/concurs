'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Building, Globe, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Contest, ContestFormData } from '@/types/contest';

interface ContestFormProps {
  contest?: Contest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ContestForm({ contest, isOpen, onClose, onSuccess }: ContestFormProps) {
  const [formData, setFormData] = useState<ContestFormData>({
    nume: '',
    dataDesfasurarii: '',
    localitate: '',
    locatie: '',
    adresa: '',
    descriere: '',
    logoUrl: '',
    linkSiteOficial: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      tiktok: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contest) {
      setFormData({
        nume: contest.nume,
        dataDesfasurarii: contest.dataDesfasurarii.split('T')[0],
        localitate: contest.localitate,
        locatie: contest.locatie,
        adresa: contest.adresa,
        descriere: contest.descriere,
        logoUrl: contest.logoUrl || '',
        linkSiteOficial: contest.linkSiteOficial || '',
        socialMedia: {
          facebook: contest.socialMedia?.facebook || '',
          instagram: contest.socialMedia?.instagram || '',
          tiktok: contest.socialMedia?.tiktok || '',
        },
      });
    } else {
      setFormData({
        nume: '',
        dataDesfasurarii: '',
        localitate: '',
        locatie: '',
        adresa: '',
        descriere: '',
        logoUrl: '',
        linkSiteOficial: '',
        socialMedia: {
          facebook: '',
          instagram: '',
          tiktok: '',
        },
      });
    }
    setError('');
  }, [contest, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = contest ? `/api/contests/${contest._id}` : '/api/contests';
      const method = contest ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dataDesfasurarii: formData.dataDesfasurarii,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.error || 'A apărut o eroare');
      }
    } catch (error) {
      setError('A apărut o eroare. Încercați din nou.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Te rog să selectezi un fișier imagine valid');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Imaginea este prea mare. Dimensiunea maximă este 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('fileName', `contest-logo-${Date.now()}`);
      uploadData.append('folder', '/contest-logos');

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          logoUrl: data.url,
        }));
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Eroare la încărcarea imaginii');
      }
    } catch (error) {
      setError('Eroare la încărcarea imaginii. Încearcă din nou.');
    } finally {
      setUploading(false);
    }
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
            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {contest ? 'Editează Concursul' : 'Concurs Nou'}
              </h2>
              <Button onClick={onClose} variant="ghost" size="sm" className="rounded-2xl p-3">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informații de bază */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Informații de bază</h3>

                    <div>
                      <Label htmlFor="nume">Numele concursului *</Label>
                      <Input id="nume" name="nume" value={formData.nume} onChange={handleChange} required placeholder="ex: Cupa de Dans București 2025" />
                    </div>

                    <div>
                      <Label htmlFor="dataDesfasurarii">Data desfășurării *</Label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input id="dataDesfasurarii" name="dataDesfasurarii" type="date" value={formData.dataDesfasurarii} onChange={handleChange} required className="pl-10" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="localitate">Localitatea *</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input id="localitate" name="localitate" value={formData.localitate} onChange={handleChange} required className="pl-10" placeholder="ex: București" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="locatie">Locația *</Label>
                      <div className="relative mt-1">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input id="locatie" name="locatie" value={formData.locatie} onChange={handleChange} required className="pl-10" placeholder="ex: Palatul Copiilor" />
                      </div>
                    </div>

                    <div>
                       <Label htmlFor="adresa">Adresa completă *</Label>
                      <Input id="adresa" name="adresa" value={formData.adresa} onChange={handleChange} required placeholder="ex: Bulevardul Tineretului 8-10, Sector 4" />
                    </div>
                  </div>

                  {/* Detalii suplimentare */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Detalii suplimentare</h3>

                    <div>
                      <Label htmlFor="logoUrl">Logo concurs</Label>
                      <div className="space-y-4 mt-1">
                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-400">Încarcă imagine din dispozitiv</Label>
                          <div className="mt-1 flex items-center space-x-3">
                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400" />
                            {uploading && (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-blue-600">Se încarcă...</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">sau</span>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-600 dark:text-gray-400">Introdu URL-ul imaginii</Label>
                          <div className="relative mt-1">
                            <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input id="logoUrl" name="logoUrl" type="url" value={formData.logoUrl} onChange={handleChange} className="pl-10" placeholder="https://example.com/logo.jpg" />
                          </div>
                        </div>

                        {formData.logoUrl && (
                          <div>
                            <Label className="text-sm text-gray-600 dark:text-gray-400">Previzualizare logo</Label>
                            <div className="mt-2 relative w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                              <img src={formData.logoUrl} alt="Logo preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="linkSiteOficial">Site oficial</Label>
                      <div className="relative mt-1">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input id="linkSiteOficial" name="linkSiteOficial" type="url" value={formData.linkSiteOficial} onChange={handleChange} className="pl-10" placeholder="https://example.com" />
                      </div>
                    </div>

                    <div>
                      <Label>Social Media</Label>
                      <div className="space-y-2 mt-1">
                        <Input name="socialMedia.facebook" value={formData.socialMedia?.facebook || ''} onChange={handleChange} placeholder="Facebook URL" />
                        <Input name="socialMedia.instagram" value={formData.socialMedia?.instagram || ''} onChange={handleChange} placeholder="Instagram URL" />
                        <Input name="socialMedia.tiktok" value={formData.socialMedia?.tiktok || ''} onChange={handleChange} placeholder="TikTok URL" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descriere">Descrierea concursului *</Label>
                  <Textarea id="descriere" name="descriere" value={formData.descriere} onChange={handleChange} required rows={4} placeholder="Descrie concursul, categoriile de vârstă, tipurile de dans, premiile, etc." />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button type="button" onClick={onClose} variant="outline" className="rounded-xl">Anulează</Button>
                  <Button type="submit" disabled={loading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6">
                    {loading ? 'Se salvează...' : contest ? 'Actualizează' : 'Creează'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
