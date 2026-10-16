"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BatteryCharging, Heart, Loader2 } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { supabase } from '@/lib/supabase';

export default function ChargeurBatteriePage() {
  const { language, t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'chargeur-batterie');

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
            <Link href="/" className="hover:text-[#F7941D]">Accueil</Link>
            <Link href="/coffres-forts" className="hover:text-[#F7941D]">Coffres-forts</Link>
            <Link href="/extracteur" className="hover:text-[#F7941D]">Extracteurs</Link>
            <Link href="/chargeur-batterie" className="text-[#F7941D] font-bold">Chargeur batterie</Link>
            <Link href="/contact" className="hover:text-[#F7941D]">Contact</Link>
          </nav>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#121212] to-[#303030] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
            <BatteryCharging size={48} className="text-[#F7941D]" />
            Chargeur de batterie
          </h1>
          <p className="text-xl text-gray-300">Chargeurs de batterie performants pour tous vos besoins</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <p className="text-gray-600"><strong>{products.length}</strong> produits trouvés</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#F7941D]" size={48} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-lg">
            <p>Aucun produit trouvé dans cette catégorie pour le moment.</p>
            <p className="text-sm mt-2">Ajoutez des produits depuis le panneau d'administration avec la catégorie "chargeur-batterie".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((produit) => (
              <div key={produit.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden">
                <div className="h-48 bg-gray-100">
                  <img src={produit.image || '/images/placeholder.jpg'} alt={produit.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#121212] mb-2">{language === 'ar' && produit.name_ar ? produit.name_ar : produit.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-[#F7941D]">{produit.price?.toLocaleString()} DA</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/produit/${produit.id}`} className="flex-1 bg-[#F7941D] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-center">
                      Voir le produit
                    </Link>
                    <button className="px-4 py-3 border border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D] rounded-lg">
                      <Heart size={20} />
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
          <p>© 2026 LE COIN BRICO. Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
