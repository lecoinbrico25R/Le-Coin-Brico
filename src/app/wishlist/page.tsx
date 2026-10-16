"use client";

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export default function WishlistPage() {
  const { language, t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#121212] text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
              <img src="/images/logo.png" alt="LCB" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-xl">LE COIN BRICO</h1>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-[#F7941D]">{t('header.home')}</Link>
            <Link href="/contact" className="hover:text-[#F7941D]">{t('header.contact')}</Link>
          </nav>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-[#121212] mb-2">{t('header.favorites') || 'Mes Favoris'}</h1>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
          <Link href="/" className="bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Découvrir nos produits
          </Link>
        </div>
      </div>

      <footer className="bg-[#121212] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 LE COIN BRICO. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
