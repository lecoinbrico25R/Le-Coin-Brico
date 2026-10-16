"use client";

import Link from 'next/link';
import { User, Lock, LogIn } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export default function LoginPage() {
  const { language, t } = useTranslation();

  const handleClick = () => {
    alert("L'espace client sera bientôt disponible !");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white p-8 rounded-xl shadow-lg border w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img src="/images/logo.png" alt="LCB" className="w-16 h-16 mx-auto object-contain" />
          </Link>
          <h1 className="text-2xl font-bold text-[#121212]">{t('header.account') || 'Mon compte'}</h1>
          <p className="text-gray-500 mt-2">Connectez-vous pour accéder à votre espace</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleClick(); }}>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="email" placeholder="votre@email.com" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-[#F7941D] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="password" placeholder="••••••••" className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-[#F7941D] outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <LogIn size={20} />
            Se connecter
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link href="/admin/login" className="text-[#F7941D] hover:underline">Espace Administrateur</Link>
        </div>
      </div>
    </div>
  );
}
