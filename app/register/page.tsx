'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Music, User, Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Parolele nu coincid');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nume: formData.nume,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });
      
      if (result?.error) {
        setError('Eroare la autentificarea cu Google. Încercați din nou.');
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('A apărut o eroare la autentificarea cu Google.');
    } finally {
      setGoogleLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="p-4 bg-white/20 rounded-3xl mx-auto mb-6 w-fit"
          >
            <Music className="h-12 w-12" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4">Cont creat cu succes!</h2>
          <p className="text-lg mb-4">Vei fi redirecționat către pagina de autentificare...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/90 backdrop-blur-md shadow-2xl border border-white/20">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                <Music className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Înregistrare
            </CardTitle>
            <p className="text-gray-600">
              Creează un cont pentru organizatori
            </p>
          </CardHeader>

          <CardContent>
            {/* Google Sign In Button */}
            <div className="mb-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-blue-500 bg-white hover:bg-gray-50 text-gray-700 rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                <Chrome className="h-5 w-5 mr-3 text-blue-500" />
                {googleLoading ? 'Se conectează...' : 'Continuă cu Google'}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">sau</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    name="nume"
                    placeholder="Numele complet"
                    value={formData.nume}
                    onChange={handleChange}
                    required
                    className="pl-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Adresa de email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Parola (min. 6 caractere)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-12 pr-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirmă parola"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-12 pr-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                {loading ? 'Se creează contul...' : 'Creează cont'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Ai deja un cont?{' '}
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  Conectează-te aici
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-700 text-sm hover:underline"
              >
                ← Înapoi la pagina principală
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
