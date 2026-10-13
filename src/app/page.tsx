"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, Shield, CreditCard, Headphones, Search, User, Heart, ShoppingCart, Phone, Menu } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export default function Home() {
  const { language, setLanguage, t } = useTranslation();
  const [siteSettings, setSiteSettings] = useState({
    phone: '0560 14 36 57',
    email: 'le.coin.brico25@gmail.com',
    address: 'Cité ONAMA Constantine Algérie',
    opening_hours: 'Dim - Jeu : 9h - 18h, Vendredi : Fermé, Samedi : 9h - 13h'
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => { 
    loadSettings();
    loadProducts();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (error) throw error;
      if (data) {
        setSiteSettings({
          phone: data.phone || siteSettings.phone,
          email: data.email || siteSettings.email,
          address: data.address || siteSettings.address,
          opening_hours: data.opening_hours || siteSettings.opening_hours
        });
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true })
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="bg-[#121212] text-white py-2 text-sm">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <span className="flex items-center gap-2"><span className="text-[#F7941D]">🚚</span>{t('header.delivery')}</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Phone size={14} className="text-[#F7941D]" />Besoin d'aide ? {siteSettings.phone}</span>
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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-1">
                <img src="/images/logo.png" alt="LE COIN BRICO" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-[#121212] font-bold text-2xl leading-tight">LE COIN BRICO</h1>
                <p className="text-xs text-gray-500">{t('footer.slogan')}</p>
              </div>
            </div>
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
              <button className="flex flex-col items-center gap-1 hover:text-[#F7941D]"><User size={24} /><span className="text-xs">{t('header.account')}</span></button>
              <button className="flex flex-col items-center gap-1 hover:text-[#F7941D] relative"><Heart size={24} /><span className="absolute -top-2 -right-2 bg-[#F7941D] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span><span className="text-xs">{t('header.favorites')}</span></button>
              <button className="flex flex-col items-center gap-1 hover:text-[#F7941D] relative"><ShoppingCart size={24} /><span className="absolute -top-2 -right-2 bg-[#F7941D] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span><span className="text-xs">{t('header.cart')}</span></button>
            </div>
          </div>
        </div>

        <nav className="bg-[#121212] text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6 py-3 overflow-x-auto">
              <button className="bg-[#F7941D] hover:bg-orange-600 px-6 py-2 rounded-lg flex items-center gap-2 font-medium whitespace-nowrap"><Menu size={20} />{t('header.categories')}</button>
              <ul className="flex items-center gap-6">
                <li><a href="/" className="hover:text-[#F7941D] whitespace-nowrap font-medium border-b-2 border-[#F7941D] pb-1">{t('header.home')}</a></li>
                <li><a href="/coffres-forts" className="hover:text-[#F7941D] whitespace-nowrap">{t('header.safes')}</a></li>
                <li><a href="/extracteur" className="hover:text-[#F7941D] whitespace-nowrap">{t('header.extractors')}</a></li>
                <li><a href="/postes-a-souder" className="hover:text-[#F7941D] whitespace-nowrap">Postes à souder</a></li>
                <li><a href="/contact" className="hover:text-[#F7941D] whitespace-nowrap">{t('header.contact')}</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <section className="relative bg-gradient-to-r from-[#121212] to-[#303030] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-coffres.jpg')" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('home.title')}<br /><span className="text-[#F7941D]">{t('home.subtitle')}</span></h1>
            <p className="text-xl mb-8 text-gray-300">{t('home.description')}</p>
            <a href="/coffres-forts" className="inline-block bg-[#F7941D] hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors">{t('home.cta')}</a>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3"><Truck className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.delivery')}</p><p className="text-sm text-gray-500">{t('home.features.deliveryDesc')}</p></div></div>
            <div className="flex items-center gap-3"><Shield className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.warranty')}</p><p className="text-sm text-gray-500">{t('home.features.warrantyDesc')}</p></div></div>
            <div className="flex items-center gap-3"><CreditCard className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.payment')}</p><p className="text-sm text-gray-500">{t('home.features.paymentDesc')}</p></div></div>
            <div className="flex items-center gap-3"><Headphones className="text-[#F7941D]" size={36} /><div><p className="font-bold text-[#121212]">{t('home.features.support')}</p><p className="text-sm text-gray-500">{t('home.features.supportDesc')}</p></div></div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#121212] mb-8 text-center">Nos produits</h2>
          
          {loadingProducts ? (
            <p className="text-center text-gray-500">Chargement des produits...</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500">Aucun produit disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link href={`/produit/${product.id}`} key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 block">
                  <div className="h-48 overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Pas d'image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 bg-orange-100 text-[#F7941D] text-xs rounded-full mb-2">{product.category}</span>
                    <h3 className="font-bold text-lg text-[#121212] mb-2">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#F7941D]">{product.price.toLocaleString()} DA</span>
                      <button className="bg-[#121212] text-white p-2 rounded-lg hover:bg-[#F7941D] transition-colors">
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#121212] mb-12">{t('home.howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: 1, title: t('home.step1'), desc: t('home.step1Desc') },
              { num: 2, title: t('home.step2'), desc: t('home.step2Desc') },
              { num: 3, title: t('home.step3'), desc: t('home.step3Desc') },
              { num: 4, title: t('home.step4'), desc: t('home.step4Desc') },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="bg-[#F7941D] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{step.num}</div>
                <h3 className="font-bold text-[#121212] mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#121212] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">{t('footer.company')}</h3>
              <p className="text-gray-400">{t('footer.slogan')}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.navigation')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-[#F7941D]">{t('header.home')}</a></li>
                <li><a href="/coffres-forts" className="hover:text-[#F7941D]">{t('header.safes')}</a></li>
                <li><a href="/contact" className="hover:text-[#F7941D]">{t('header.contact')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.info')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[#F7941D]">{t('footer.shipping')}</a></li>
                <li><a href="#" className="hover:text-[#F7941D]">{t('footer.payment')}</a></li>
                <li><a href="/contact" className="hover:text-[#F7941D]">{t('footer.contactPage')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{t('footer.contact')}</h4>
              <p className="text-gray-400 mb-2">📞 {siteSettings.phone}</p>
              <p className="text-gray-400 mb-2">✉️ {siteSettings.email}</p>
              <p className="text-gray-400">📍 {siteSettings.address}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 LE COIN BRICO. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}