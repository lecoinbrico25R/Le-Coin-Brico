"use client";

import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { language, t } = useTranslation();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

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

      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[#121212] mb-8 flex items-center gap-3">
          <Heart className="text-[#F7941D]" />
          {t('header.favorites') || 'Mes Favoris'}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">Vous n'avez pas encore ajouté de produits à vos favoris.</p>
            <Link href="/" className="bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2">
              Découvrir nos produits <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                <div className="h-48 bg-gray-100">
                  <img src={item.image || '/images/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-[#121212] mb-2 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <span className="text-xl font-bold text-[#F7941D]">{item.price.toLocaleString()} DA</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { addToCart(item); removeFromWishlist(item.id); }} className="flex-1 bg-[#121212] hover:bg-[#F7941D] text-white font-semibold py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1">
                      <ShoppingCart size={16} /> Ajouter
                    </button>
                    <button onClick={() => removeFromWishlist(item.id)} className="p-2 border border-gray-200 hover:border-red-500 hover:text-red-500 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-[#121212] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 LE COIN BRICO. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
