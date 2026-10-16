"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BatteryCharging, Heart, ShoppingCart, Loader2, Eye, Menu, X } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function ChargeurBatteriePage() {
  const { language } = useTranslation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const { data } = await supabase.from('products').select('*').eq('category', 'chargeur-batterie');
      setProducts(data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/coffres-forts', label: 'Coffres-forts' },
    { href: '/extracteur', label: "Extracteur d'air" },
    { href: '/postes-a-souder', label: 'Postes à souder' },
    { href: '/chargeur-batterie', label: 'Chargeur batterie', highlight: true },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#121212] text-white sticky top-0 z-50 shadow-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
              <img src="/images/logo.png" alt="LCB" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">LE COIN BRICO</h1>
              <p className="text-[10px] text-gray-400 hidden sm:block">La puissance entre vos mains</p>
            </div>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`transition-colors ${link.highlight ? 'text-[#F7941D] font-bold' : 'hover:text-[#F7941D]'}`}>{link.label}</Link>
            ))}
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-800 rounded-lg">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="md:hidden bg-[#1a1a1a] border-t border-gray-800 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-3 rounded-lg ${link.highlight ? 'bg-[#F7941D] text-white font-bold' : 'text-gray-300 hover:bg-gray-800'}`}>{link.label}</Link>
            ))}
          </nav>
        )}
      </header>

      <section className="bg-gradient-to-br from-[#121212] via-[#1f1f1f] to-[#303030] text-white py-16 sm:py-20 md:py-24 min-h-[200px] sm:min-h-[250px] flex items-center">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 flex items-center gap-3 sm:gap-4 flex-wrap">
            <BatteryCharging size={32} className="text-[#F7941D]" />
            Nos Chargeurs de batterie
          </h1>
          <p className="text-base sm:text-xl text-gray-300">Puissance et fiabilité</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 sm:py-12 flex-grow">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <p className="text-gray-600"><strong>{products.length}</strong> produits trouvés</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-[#F7941D]" size={48} /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-lg"><p>Aucun produit trouvé dans cette catégorie.</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((produit) => {
              const inWishlist = isInWishlist(produit.id);
              return (
                <div key={produit.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                  <Link href={`/produit/${produit.id}`} className="block bg-gray-100 aspect-square overflow-hidden">
                    <img src={produit.image || '/images/placeholder.jpg'} alt={produit.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <Link href={`/produit/${produit.id}`} className="font-bold text-sm sm:text-base text-[#121212] mb-2 line-clamp-2 hover:text-[#F7941D] min-h-[2.5rem]">
                      {language === 'ar' && produit.name_ar ? produit.name_ar : produit.name}
                    </Link>
                    <div className="text-xl sm:text-2xl font-bold text-[#F7941D] mb-3 sm:mb-4">{produit.price?.toLocaleString()} DA</div>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => addToCart({ id: produit.id, name: produit.name, price: produit.price, image: produit.image })} className="flex-1 bg-[#F7941D] hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1 min-h-[44px]">
                        <ShoppingCart size={16} /> <span className="hidden sm:inline">Ajouter</span>
                      </button>
                      <Link href={`/produit/${produit.id}`} className="p-2.5 border border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D] rounded-lg flex items-center justify-center min-w-[44px] min-h-[44px]">
                        <Eye size={18} />
                      </Link>
                      <button onClick={() => inWishlist ? removeFromWishlist(produit.id) : addToWishlist({ id: produit.id, name: produit.name, price: produit.price, image: produit.image })} className={`p-2.5 border rounded-lg flex items-center justify-center min-w-[44px] min-h-[44px] ${inWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 hover:border-[#F7941D]'}`}>
                        <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="bg-[#121212] text-white py-6 sm:py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2026 LE COIN BRICO. Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
