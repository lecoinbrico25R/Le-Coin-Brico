"use client";

import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { language, t } = useTranslation();
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

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
          <ShoppingCart className="text-[#F7941D]" />
          {t('header.cart') || 'Mon Panier'}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">Votre panier est actuellement vide.</p>
            <Link href="/" className="bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2">
              Retour à la boutique <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
                  <img src={item.image || '/images/placeholder.jpg'} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                  <div className="flex-grow">
                    <h3 className="font-bold text-[#121212]">{item.name}</h3>
                    <p className="text-[#F7941D] font-bold">{item.price.toLocaleString()} DA</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-md transition-colors"><Minus size={16} /></button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-md transition-colors"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
                <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
                <div className="flex justify-between mb-4 text-gray-600">
                  <span>Sous-total</span>
                  <span>{total.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between mb-6 text-xl font-bold text-[#121212] border-t pt-4">
                  <span>Total</span>
                  <span>{total.toLocaleString()} DA</span>
                </div>
                <button className="w-full bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors mb-2">
                  Passer la commande
                </button>
                <button onClick={clearCart} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-lg transition-colors">
                  Vider le panier
                </button>
              </div>
            </div>
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
