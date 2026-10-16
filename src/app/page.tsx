"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, Shield, CreditCard, Headphones, Search, User, Heart, ShoppingCart, Phone, Menu, Loader2, Eye } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function HomePage() {
  const { language, t } = useTranslation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentProducts();
  }, []);

  const loadRecentProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setRecentProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits récents:', error);
    } finally {
      setLoading(false);
    }
  };

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
              <p className="text-xs text-gray-400">{t('footer.slogan') || 'La puissance entre vos mains'}</p>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-[#F7941D] font-bold">Accueil</Link>
            <Link href="/coffres-forts" className="hover:text-[#F7941D]">Coffres-forts</Link>
            <Link href="/extracteur" className="hover:text-[#F7941D]">Extracteur d'air</Link>
            <Link href="/postes-a-souder" className="hover:text-[#F7941D]">Postes à souder</Link>
            <Link href="/chargeur-batterie" className="hover:text-[#F7941D]">Chargeur batterie</Link>
            <Link href="/contact" className="hover:text-[#F7941D]">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#121212] to-[#303030] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-4">{t('home.title') || 'La puissance'} <span className="text-[#F7941D]">{t('home.subtitle') || 'entre vos mains'}</span></h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{t('home.description') || 'Découvrez notre sélection de coffres-forts et extracteurs de haute qualité.'}</p>
          <Link href="/coffres-forts" className="bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors inline-block">
            {t('home.cta') || 'Voir nos produits'}
          </Link>
        </div>
      </section>

      {/* Produits Récents */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[#121212] mb-8 text-center">Produits Récents</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#F7941D]" size={48} />
          </div>
        ) : recentProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-lg">
            <p>Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.map((produit) => {
              const inWishlist = isInWishlist(produit.id);
              return (
                <div key={produit.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                  {/* ✅ LIEN CLIQUABLE SUR L'IMAGE */}
                  <Link href={`/produit/${produit.id}`} className="h-48 bg-gray-100 block">
                    <img src={produit.image || '/images/placeholder.jpg'} alt={produit.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    {/* ✅ LIEN CLIQUABLE SUR LE NOM */}
                    <Link href={`/produit/${produit.id}`} className="font-bold text-[#121212] mb-2 line-clamp-2 hover:text-[#F7941D] transition-colors">
                      {language === 'ar' && produit.name_ar ? produit.name_ar : produit.name}
                    </Link>
                    <div className="flex items-center gap-2 mb-4 mt-auto">
                      <span className="text-2xl font-bold text-[#F7941D]">{produit.price?.toLocaleString()} DA</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => addToCart({ id: produit.id, name: produit.name, price: produit.price, image: produit.image })} className="flex-1 bg-[#F7941D] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1">
                        <ShoppingCart size={16} /> Ajouter
                      </button>
                      {/* ✅ BOUTON ŒIL POUR VOIR LES DÉTAILS */}
                      <Link href={`/produit/${produit.id}`} className="p-3 border border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D] rounded-lg transition-colors flex items-center justify-center" title="Voir les détails">
                        <Eye size={20} />
                      </Link>
                      <button onClick={() => inWishlist ? removeFromWishlist(produit.id) : addToWishlist({ id: produit.id, name: produit.name, price: produit.price, image: produit.image })} className={`p-3 border rounded-lg transition-colors ${inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D]'}`}>
                        <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Truck className="mx-auto text-[#F7941D] mb-4" size={48} />
              <h3 className="font-bold text-lg mb-2">{t('home.features.delivery') || 'Livraison rapide'}</h3>
              <p className="text-gray-600 text-sm">{t('home.features.deliveryDesc') || 'Partout en Algérie'}</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto text-[#F7941D] mb-4" size={48} />
              <h3 className="font-bold text-lg mb-2">{t('home.features.warranty') || 'Produits garantis'}</h3>
              <p className="text-gray-600 text-sm">{t('home.features.warrantyDesc') || 'Qualité assurée'}</p>
            </div>
            <div className="text-center">
              <CreditCard className="mx-auto text-[#F7941D] mb-4" size={48} />
              <h3 className="font-bold text-lg mb-2">{t('home.features.payment') || 'Paiement à la livraison'}</h3>
              <p className="text-gray-600 text-sm">{t('home.features.paymentDesc') || 'Ou CIB / Dahabia'}</p>
            </div>
            <div className="text-center">
              <Headphones className="mx-auto text-[#F7941D] mb-4" size={48} />
              <h3 className="font-bold text-lg mb-2">{t('home.features.support') || 'Service client'}</h3>
              <p className="text-gray-600 text-sm">{t('home.features.supportDesc') || '7j/7 à votre écoute'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 LE COIN BRICO. {t('footer.rights') || 'Tous droits réservés'}</p>
        </div>
      </footer>
    </div>
  );
}
