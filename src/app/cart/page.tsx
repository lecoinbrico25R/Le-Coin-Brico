"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, CheckCircle, AlertCircle, Truck, User, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

export default function CartPage() {
  const { language, t } = useTranslation();
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    wilaya: '',
    commune: '',
    address: '',
    notes: ''
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const { error } = await supabase.from('orders').insert([
        {
          client_name: formData.client_name,
          client_phone: formData.client_phone,
          client_email: formData.client_email,
          wilaya: formData.wilaya,
          commune: formData.commune,
          address: formData.address,
          notes: formData.notes,
          products: items, // Envoie la liste des produits en JSON
          total: total,
          status: 'En attente'
        }
      ]);

      if (error) throw error;

      setStatus('success');
      clearCart(); // Vide le panier après commande réussie
      setFormData({ client_name: '', client_phone: '', client_email: '', wilaya: '', commune: '', address: '', notes: '' });
    } catch (error) {
      console.error('Erreur commande:', error);
      setStatus('error');
    }
  };

  if (items.length === 0 && status !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <header className="bg-[#121212] text-white p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
                <img src="/images/logo.png" alt="LCB" className="w-full h-full object-contain" />
              </div>
              <h1 className="font-bold text-xl">LE COIN BRICO</h1>
            </Link>
          </div>
        </header>
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-[#121212] mb-2">Votre panier est vide</h1>
            <Link href="/" className="bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-block mt-4">
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-[#121212] mb-2">Commande envoyée avec succès !</h1>
          <p className="text-gray-600 mb-6">Nous vous contacterons bientôt pour confirmer la livraison.</p>
          <Link href="/" className="bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-block">
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#121212] text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
              <img src="/images/logo.png" alt="LCB" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-bold text-xl">LE COIN BRICO</h1>
          </Link>
        </div>
      </header>

      <div className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-[#121212] mb-8 flex items-center gap-3">
          <ShoppingCart className="text-[#F7941D]" />
          Mon Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
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

          {/* Résumé et Formulaire */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
              <h2 className="text-xl font-bold mb-4">Résumé</h2>
              <div className="flex justify-between mb-6 text-xl font-bold text-[#121212] border-t pt-4">
                <span>Total</span>
                <span>{total.toLocaleString()} DA</span>
              </div>

              {!showCheckout ? (
                <button 
                  onClick={() => setShowCheckout(true)} 
                  className="w-full bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Truck size={20} /> Passer la commande
                </button>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-3 mt-4 border-t pt-4">
                  <h3 className="font-bold text-[#121212] flex items-center gap-2"><User size={18} /> Vos informations</h3>
                  
                  <input required placeholder="Nom complet *" value={formData.client_name} onChange={(e) => setFormData({...formData, client_name: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                  <input required type="tel" placeholder="Téléphone *" value={formData.client_phone} onChange={(e) => setFormData({...formData, client_phone: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                  <input type="email" placeholder="Email (optionnel)" value={formData.client_email} onChange={(e) => setFormData({...formData, client_email: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                  
                  <h3 className="font-bold text-[#121212] flex items-center gap-2 pt-2"><MapPin size={18} /> Livraison</h3>
                  
                  <input required placeholder="Wilaya *" value={formData.wilaya} onChange={(e) => setFormData({...formData, wilaya: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                  <input required placeholder="Commune *" value={formData.commune} onChange={(e) => setFormData({...formData, commune: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                  <input required placeholder="Adresse détaillée *" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                  <textarea placeholder="Notes (optionnel)" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full p-2 border rounded-lg text-sm" rows={2}></textarea>

                  {status === 'error' && (
                    <div className="p-2 bg-red-50 text-red-700 rounded text-sm flex items-center gap-1">
                      <AlertCircle size={14} /> Erreur lors de l'envoi.
                    </div>
                  )}

                  <button type="submit" disabled={status === 'loading'} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                    {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                    Confirmer la commande
                  </button>
                  <button type="button" onClick={() => setShowCheckout(false)} className="w-full text-gray-500 text-sm hover:text-gray-700">Annuler</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
