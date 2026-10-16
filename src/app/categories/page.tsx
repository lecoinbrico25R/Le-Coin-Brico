"use client";

import Link from 'next/link';
import { Shield, Wind, Zap, BatteryCharging } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export default function CategoriesPage() {
  const { language, t } = useTranslation();

  const categories = [
    { name: t('header.safes'), href: '/coffres-forts', icon: Shield, desc: language === 'ar' ? 'أمان وحماية' : 'Sécurité et protection' },
    { name: t('header.extractors'), href: '/extracteur', icon: Wind, desc: language === 'ar' ? 'تهوية احترافية' : 'Ventilation professionnelle' },
    { name: 'Postes à souder', href: '/postes-a-souder', icon: Zap, desc: language === 'ar' ? 'لحام عالي الجودة' : 'Soudure de haute qualité' },
    { name: 'Chargeur batterie', href: '/chargeur-batterie', icon: BatteryCharging, desc: language === 'ar' ? 'شحن سريع وفعال' : 'Charge rapide et efficace' },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#121212] text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
              <img src="/images/logo.png" alt="LCB" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-xl">LE COIN BRICO</h1>
              <p className="text-xs text-gray-400">{t('footer.slogan')}</p>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-[#F7941D]">{t('header.home')}</Link>
            <Link href="/coffres-forts" className="hover:text-[#F7941D]">{t('header.safes')}</Link>
            <Link href="/extracteur" className="hover:text-[#F7941D]">{t('header.extractors')}</Link>
            <Link href="/postes-a-souder" className="hover:text-[#F7941D]">Postes à souder</Link>
            <Link href="/chargeur-batterie" className="hover:text-[#F7941D]">Chargeur batterie</Link>
            <Link href="/contact" className="hover:text-[#F7941D]">{t('header.contact')}</Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#121212] to-[#303030] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{t('header.categories')}</h1>
          <p className="text-xl text-gray-300">Explorez notre catalogue complet</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 text-center transition-shadow group">
              <div className="bg-[#F7941D] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform">
                <cat.icon size={32} />
              </div>
              <h2 className="text-xl font-bold text-[#121212] mb-2">{cat.name}</h2>
              <p className="text-gray-500">{cat.desc}</p>
            </Link>
          ))}
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
