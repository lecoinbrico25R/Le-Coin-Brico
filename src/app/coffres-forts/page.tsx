"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Filter, Heart, Shield, Loader2 } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { supabase } from '@/lib/supabase';

export default function CoffresFortsPage() {
  const { language, setLanguage, t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // ✅ On récupère les produits depuis Supabase où la catégorie est 'coffres-forts'
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'coffres-forts');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* HEADER (Temporaire en attendant de régler le layout global) */}
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
            <Link href="/coffres-forts" className="text-[#F7941D] font-bold">{t('header.safes')}</Link>
            <Link href="/extracteur" className="hover:text-[#F7941D]">{t('header.extractors')}</Link>
            <Link href="/contact" className="hover:text-[#F7941D]">{t('header.contact')}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLanguage('fr')} className={`px-2 py-1 rounded text-sm ${language === 'fr' ? 'bg-[#F7941D] text-white' : 'text-gray-300'}`}>FR</button>
            <span className="text-gray-500">|</span>
            <button onClick={() => setLanguage('ar')} className={`px-2 py-1 rounded text-sm ${language === 'ar' ? 'bg-[#F7941D] text-white' : 'text-gray-300'}`}>عربي</button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-[#121212] to-[#303030] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
            <Shield size={48} className="text-[#F7941D]" />
            {t('header.safes')}
          </h1>
          <p className="text-xl text-gray-300">{t('home.description')}</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR FILTRES */}
          <aside className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-[#121212] text-lg mb-4 flex items-center gap-2">
                <Filter size={20} className="text-[#F7941D]" /> {t('products.filters') || 'Filtres'}
              </h3>
              {/* Tu pourras ajouter tes vrais filtres ici plus tard */}
            </div>
          </aside>

          {/* LISTE DES PRODUITS */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <p className="text-gray-600"><strong>{products.length}</strong> {t('products.found') || 'produits trouvés'}</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-[#F7941D]" size={48} />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500 bg-white rounded-lg">
                <p>Aucun produit trouvé dans cette catégorie pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((produit) => (
                  <div key={produit.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden relative group">
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      <img 
                        src={produit.image || '/images/placeholder.jpg'} 
                        alt={language === 'ar' ? produit.name_ar : produit.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#121212] mb-2 line-clamp-2">
                        {language === 'ar' && produit.name_ar ? produit.name_ar : produit.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-[#F7941D]">{produit.price?.toLocaleString()} DA</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/produit/${produit.id}`} className="flex-1 bg-[#F7941D] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-center transition-colors">
                          {t('products.view') || 'Voir'}
                        </Link>
                        <button className="px-4 py-3 border border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D] rounded-lg transition-colors">
                          <Heart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#121212] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 LE COIN BRICO. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}
