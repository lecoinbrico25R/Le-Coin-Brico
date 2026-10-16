"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, Shield, CreditCard, Headphones, Search, User, Heart, ShoppingCart, Phone, Menu, Loader2 } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function Home() {
  const { language, setLanguage, t } = useTranslation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [siteSettings, setSiteSettings] = useState({ phone: '0560143657', email: 'le.coin.brico25@gmail.com' });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadSettings();
    loadProducts();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (!error && data) {
        setSiteSettings({ phone: data.phone || siteSettings.phone, email: data.email || siteSettings.email });
      }
    } catch (error) { console.error('Erreur chargement paramètres:', error); }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(8);
      if (!error && data) setRecentProducts(data);
    } catch (error) { console.error('Erreur chargement produits:', error); }
    finally { setLoadingProducts(false); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="bg-[#121212] text-white py-2 text-sm">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <span className="flex items-center gap-2"><span className="text-[#F7941D]">🚚</span> {t('header.delivery') || 'Livraison dans toute l\'Algérie'}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Phone size={14} className="text-[#F7941D]" /> {t('header.help') || 'Besoin d\'aide'} {siteSettings.phone}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setLanguage('fr')} className={`px-2 py-1 rounded text-sm font-medium ${language === 'fr' ? 'bg-[#F7941D] text-white' : 'text-gray-300 hover:text-white'}`}>FR</button>
                <span className="text-gray-500">|</span>
                <button onClick={() => setLanguage('ar')} className={`px-2 py-1 rounded text-sm font-medium ${language === 'ar' ? 'bg-[#F7941D] text-white' : 'text-gray-300 hover:text-white'}`}>عربي</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-1">
                <img src="/images/logo.png" alt="LE COIN BRICO" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-[#121212] font-bold text-2xl leading-tight">LE COIN BRICO</h1>
                <p className="text-xs text-gray-500">{t('footer.slogan') || 'La puissance entre vos mains'}</p>
              </div>
            </Link>
            <div className="flex-1 max-w-2xl hidden md:flex">
              <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden">
                <input type="text" placeholder={language === 'ar' ? 'ابحث عن منتج...' : 'Rechercher un produit...'} className="flex-1 px-4 py-3 focus:outline-none" />
                <select className="px-4 py-3 bg-gray-50 border-l border-gray-200 focus:outline-none">
                  <option>{language === 'ar' ? 'جميع الفئات' : 'Toutes catégories'}</option>
                </select>
                <button className="bg-[#F7941D] hover:bg-orange-600 text-white px-6"><Search size={20} /></button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="flex flex-col items-center gap-1 hover:text-[#F7941D]"><User size={24} /><span className="text-xs">{t('header.account') || 'Mon compte'}</span></Link>
              <Link href="/wishlist" className="flex flex-col items-center gap-1 hover:text-[#F7941D] relative"><Heart size={24} /><span className="absolute -top-2 -right-2 bg-[#F7941D] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span><span className="text-xs">{t('header.favorites') || 'Favoris'}</span></Link>
              <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-[#F7941D] relative"><ShoppingCart size={24} /><span className="absolute -top-2 -right-2 bg-[#F7941D] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span><span className="text-xs">{t('header.cart') || 'Panier'}</span></Link>
            </div>
          </div>
        </div>
        <nav className="bg-[#121212] text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6 py-3 overflow-x-auto">
              <Link href="/categories" className="bg-[#F7941D] hover:bg-orange-600 px-6 py-2 rounded-lg flex items-center gap-2 font-medium whitespace-nowrap"><Menu size={20} /> {t('header.categories') || 'Toutes catégories'}</Link>
              <ul className="flex items-center gap-6">
                <li><Link href="/" className="hover:text-[#F7941D] whitespace-nowrap font-medium border-b-2 border-[#F7941D] pb-1">{t('header.home') || 'Accueil'}</Link></li>
                <li><Link href="/coffres-forts" className="hover:text-[#F7941D] whitespace-nowrap">{t('header.safes') || 'Coffres-forts'}</Link></li>
                <li><Link href="/extracteur" className="hover:text-[#F7941D] whitespace-nowrap">{t('header.extractors') || 'Extracteur d\'air'}</Link></li>
                <li><Link href="/postes-a-souder" className="hover:text-[#F7941D] whitespace-nowrap">Postes à souder</Link></li>
                <li><Link href="/chargeur-batterie" className="hover:text-[#F7941D] whitespace-nowrap">Chargeur batterie</Link></li>
                <li><Link href="/contact" className="hover:text-[#F7941D] whitespace-nowrap">{t('header.contact') || 'Contact'}</Link></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative bg-gradient-to-r from-[#121212] to-[#303030] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-coffres.jpg')" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('home.title') || 'La puissance'}<br /><span className="text-[#F7941D]">{t('home.subtitle') || 'entre vos mains'}</span></h1>
            <p className="text-xl mb-8 text-gray-300">{t('home.description') || 'Découvrez notre sélection de coffres-forts et extracteurs de haute qualité.'}</p>
            <Link href="/coffres-forts" className="inline-block bg-[#F7941D] hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors">{t('home.cta') || 'Voir nos produits'}</Link>
          </div>
        </div>
      </section>

      {/* PRODUITS RÉCENTS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#121212] mb-8">{t('home.featured') || 'Nos produits récents'}</h2>
          {loadingProducts ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#F7941D]" size={40} /></div>
          ) : recentProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Aucun produit disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map((produit) => {
                const inWishlist = isInWishlist(produit.id);
                return (
                  <div key={produit.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-shadow flex flex-col">
                    <div className="h-48 bg-gray-100 relative group">
                      <img src={produit.image || '/images/placeholder.jpg'} alt={produit.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-[#121212] mb-2 line-clamp-2">{language === 'ar' && produit.name_ar ? produit.name_ar : produit.name}</h3>
                      <div className="flex items-center gap-2 mb-4 mt-auto">
                        <span className="text-xl font-bold text-[#F7941D]">{produit.price?.toLocaleString()} DA</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => addToCart({ id: produit.id, name: produit.name, price: produit.price, image: produit.image })} className="flex-1 bg-[#121212] hover:bg-[#F7941D] text-white font-semibold py-2 rounded-lg text-center transition-colors flex items-center justify-center gap-1 text-sm">
                          <ShoppingCart size={16} /> Ajouter
                        </button>
                        <button onClick={() => inWishlist ? removeFromWishlist(produit.id) : addToWishlist({ id: produit.id, name: produit.name, price: produit.price, image: produit.image })} className={`p-2 border rounded-lg transition-colors ${inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D]'}`}>
                          <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <Link href={`/produit/${produit.id}`} className="block w-full mt-2 text-center text-xs text-gray-500 hover:text-[#F7941D]">Voir les détails</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href="/categories" className="inline-block border-2 border-[#F7941D] text-[#F7941D] hover:bg-[#F7941D] hover:text-white font-bold px-8 py-3 rounded-lg transition-colors">
              {t('home.viewAll') || 'Voir tous les produits'}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3"><Truck className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.delivery') || 'Livraison rapide'}</p><p className="text-sm text-gray-500">{t('home.features.deliveryDesc') || 'Partout en Algérie'}</p></div></div>
            <div className="flex items-center gap-3"><Shield className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.warranty') || 'Produits garantis'}</p><p className="text-sm text-gray-500">{t('home.features.warrantyDesc') || 'Qualité assurée'}</p></div></div>
            <div className="flex items-center gap-3"><CreditCard className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.payment') || 'Paiement à la livraison'}</p><p className="text-sm text-gray-500">{t('home.features.paymentDesc') || 'Ou CIB / Dahabia'}</p></div></div>
            <div className="flex items-center gap-3"><Headphones className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.support') || 'Service client'}</p><p className="text-sm text-gray-500">{t('home.features.supportDesc') || '7j/7 à votre écoute'}</p></div></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#121212] text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div><h3 className="font-bold text-xl mb-4">{t('footer.company') || 'LE COIN BRICO'}</h3><p className="text-gray-400">{t('footer.slogan') || 'La puissance entre vos mains'}</p></div>
            <div><h4 className="font-bold mb-4">{t('footer.navigation') || 'Navigation'}</h4><ul className="space-y-2 text-gray-400"><li><Link href="/" className="hover:text-[#F7941D]">{t('header.home') || 'Accueil'}</Link></li><li><Link href="/coffres-forts" className="hover:text-[#F7941D]">{t('header.safes') || 'Coffres-forts'}</Link></li><li><Link href="/contact" className="hover:text-[#F7941D]">{t('header.contact') || 'Contact'}</Link></li></ul></div>
            <div><h4 className="font-bold mb-4">{t('footer.info') || 'Informations'}</h4><ul className="space-y-2 text-gray-400"><li><Link href="#" className="hover:text-[#F7941D]">{t('footer.shipping') || 'Livraison'}</Link></li><li><Link href="#" className="hover:text-[#F7941D]">{t('footer.payment') || 'Paiement'}</Link></li></ul></div>
            <div><h4 className="font-bold mb-4">{t('footer.contact') || 'Contact'}</h4><p className="text-gray-400 mb-2">📞 {siteSettings.phone}</p><p className="text-gray-400 mb-2">✉️ {siteSettings.email}</p><p className="text-gray-400"> {t('footer.location') || 'Algérie'}</p></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"><p>© 2026 LE COIN BRICO. {t('footer.rights') || 'Tous droits réservés'}</p></div>
        </div>
      </footer>
    </div>
  );
}
