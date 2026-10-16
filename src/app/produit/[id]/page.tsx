"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, ArrowLeft, Truck, Shield, Loader2 } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { supabase } from '@/lib/supabase';

export default function ProductDetail() {
  const { id } = useParams();
  const { language, t } = useTranslation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) {
        setProduct(data);
        setSelectedImage(data.image || (data.images && data.images[0]) || '/images/placeholder.jpg');
      }
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#F7941D]" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-[#121212] mb-4">Produit non trouvé</h1>
        <Link href="/" className="bg-[#F7941D] text-white px-6 py-3 rounded-lg">Retour à l'accueil</Link>
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#121212] text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
              <img src="/images/logo.png" alt="LCB" className="w-full h-full object-contain" />
            </div>
            <h1 className="font-bold text-xl">LE COIN BRICO</h1>
          </Link>
          <Link href="/" className="text-sm hover:text-[#F7941D] flex items-center gap-2 font-medium">
            <ArrowLeft size={16} /> Retour
          </Link>
        </div>
      </header>

      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#F7941D]">Accueil</Link> 
          <span>/</span>
          <Link href={`/${product.category}`} className="hover:text-[#F7941D] capitalize">{product.category}</Link> 
          <span>/</span>
          <span className="text-[#121212] font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
              <img src={selectedImage} alt={product.name} className="w-full h-full object-contain p-4" />
            </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-[#F7941D] ring-2 ring-[#F7941D]/20' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`Vue ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-[#121212] mb-4 leading-tight">
              {language === 'ar' && product.name_ar ? product.name_ar : product.name}
            </h1>
            <div className="text-3xl font-bold text-[#F7941D] mb-6">{product.price.toLocaleString()} DA</div>
            
            <div className="prose max-w-none text-gray-600 mb-8 whitespace-pre-wrap text-lg leading-relaxed">
              {language === 'ar' && product.description_ar ? product.description_ar : product.description}
            </div>

            <div className="space-y-3 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Truck className="text-[#F7941D]" size={20} /> 
                <span>Livraison disponible partout en Algérie</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield className="text-[#F7941D]" size={20} /> 
                <span>Produit garanti et de qualité professionnelle</span>
              </div>
            </div>

            <div className="flex gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#121212] hover:bg-[#F7941D] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
              >
                <ShoppingCart size={22} /> Ajouter au panier
              </button>
              <button 
                onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image })}
                className={`p-4 border-2 rounded-xl transition-colors ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D]'}`}
              >
                <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#121212] text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2026 LE COIN BRICO. {t('footer.rights') || 'Tous droits réservés'}</p>
        </div>
      </footer>
    </div>
  );
}
