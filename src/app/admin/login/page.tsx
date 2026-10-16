"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, User, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulation simple de connexion (à remplacer par ta vraie logique Supabase plus tard)
    if (email === 'admin@lecoinbrico.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      setError('Email ou mot de passe incorrect. Essayez admin@lecoinbrico.com / admin123');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <div className="w-16 h-16 bg-[#121212] rounded-lg flex items-center justify-center mx-auto text-[#F7941D]">
              <Shield size={32} />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#121212]">Espace Administrateur</h1>
          <p className="text-gray-500 mt-2">Connectez-vous pour gérer la boutique</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lecoinbrico.com" 
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-[#F7941D] outline-none" 
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-[#F7941D] outline-none" 
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#121212] hover:bg-[#303030] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : <><LogIn size={20} /> Se connecter</>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#F7941D]">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
