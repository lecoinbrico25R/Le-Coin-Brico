"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const phoneNumber = '213560143657';
  const defaultMessage = encodeURIComponent("Bonjour, je suis intéressé(e) par vos produits sur Le Coin Brico. Pouvez-vous m'aider ?");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => setShowTooltip(true), 5000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 12000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showTooltip && (
        <div className="bg-white text-gray-800 px-4 py-3 rounded-xl shadow-2xl border border-gray-200 max-w-[250px] relative animate-bounce">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
          >
            <X size={14} className="text-gray-600" />
          </button>
          <p className="text-sm font-medium">💬 Besoin d'aide ?</p>
          <p className="text-xs text-gray-600 mt-1">Contactez-nous directement sur WhatsApp !</p>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30"></span>
        <MessageCircle size={28} className="sm:w-8 sm:h-8 relative z-10" />
      </a>
    </div>
  );
}
