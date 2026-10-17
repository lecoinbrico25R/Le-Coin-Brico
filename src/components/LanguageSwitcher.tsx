"use client";

import { useTranslation } from '@/context/TranslationContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-[#F7941D] text-white rounded-lg transition-colors text-sm font-medium"
      aria-label="Changer la langue"
    >
      <Globe size={16} />
      <span className="uppercase">{language === 'fr' ? 'AR' : 'FR'}</span>
    </button>
  );
}
