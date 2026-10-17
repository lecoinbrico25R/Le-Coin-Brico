"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Truck, Shield, Loader2, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/coffres-forts', label: 'Coffres-forts' },
    { href: '/extracteur', label: "Extracteur d'air" },
    { href: '/postes-a-souder', label: 'Postes à souder' },
    { href: '/chargeur-batterie', label: 'Chargeur batterie' },
    { href: '/contact', label: 'Contact' },
  ];

  useEffect(() => { if (id) fetchProduct(); }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) {
        setProduct(data);
        setCurrentImageIndex(0);
      }
    } catch (error) { console.error('Erreur chargement produit:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="animate-spin text-[#F7941D]" size={48} /></div>;
  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-[#121212] mb-4">Produit non trouvé</h1>
      <Link href="/" className="bg-[#F7941D] text-white px-6 py-3 rounded-lg">Retour à l'accueil</Link>
    </div>
  );

  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleAddToCart = () => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* HEADER RESPONSIVE */}
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
              <Link key={link.href} href={link.href} className="transition-colors hover:text-[#F7941D]">{link.label}</Link>
            ))}
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-gray-800 rounded-lg">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="md:hidden bg-[#1a1a1a] border-t border-gray-800 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800">{link.label}</Link>
            ))}
          </nav>
        )}
      </header>

      <div className="flex-grow container mx-auto px-4 py-6 sm:py-12">
        {/* Fil d'ariane */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-[#F7941D]">Accueil</Link> <span>/</span>
          <Link href={`/${product.category}`} className="hover:text-[#F7941D] capitalize">{product.category}</Link> <span>/</span>
          <span className="text-[#121212] font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 bg-white p-4 sm:p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          {/* CARROUSEL PHOTOS */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group">
              {/* Image principale */}
              <img 
                src={galleryImages[currentImageIndex]} 
                alt={product.name} 
                className="w-full h-full object-contain p-4 transition-opacity duration-300"
              />
              
              {/* Bouton Précédent */}
              {galleryImages.length > 1 && (
                <button 
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#121212] p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Image précédente"
                >
                  <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                </button>
              )}
              
              {/* Bouton Suivant */}
              {galleryImages.length > 1 && (
                <button 
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#121212] p-2 sm:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Image suivante"
                >
                  <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Indicateurs de position (dots) */}
              {galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-3 py-2 rounded-full">
                  {galleryImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-[#F7941D] w-6' : 'bg-white/70'}`}
                      aria-label={`Voir image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Compteur d'images */}
              {galleryImages.length > 1 && (
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                  {currentImageIndex + 1} / {galleryImages.length}
                </div>
              )}
            </div>

            {/* Miniatures (optionnel - visible uniquement sur desktop) */}
            {galleryImages.length > 1 && (
              <div className="hidden sm:grid grid-cols-5 gap-2">
                {galleryImages.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-[#F7941D] ring-2 ring-[#F7941D]/20' : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Vue ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations Produit */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#121212] mb-3 sm:mb-4 leading-tight">
              {language === 'ar' && product.name_ar ? product.name_ar : product.name}
            </h1>
            <div className="text-2xl sm:text-3xl font-bold text-[#F7941D] mb-4 sm:mb-6">{product.price.toLocaleString()} DA</div>
            <div className="prose max-w-none text-gray-600 mb-6 sm:mb-8 whitespace-pre-wrap text-base sm:text-lg leading-relaxed">
              {language === 'ar' && product.description_ar ? product.description_ar : product.description}
            </div>
            <div className="space-y-3 mb-6 sm:mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Truck className="text-[#F7941D] flex-shrink-0" size={20} /> <span>Livraison disponible partout en Algérie</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Shield className="text-[#F7941D] flex-shrink-0" size={20} /> <span>Produit garanti et de qualité professionnelle</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
              <button onClick={handleAddToCart} className="flex-1 bg-[#121212] hover:bg-[#F7941D] text-white font-bold py-3 sm:py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg hover:shadow-xl min-h-[48px]">
                <ShoppingCart size={20} /> Ajouter au panier
              </button>
              <button onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image })} className={`p-3 sm:p-4 border-2 rounded-xl transition-colors flex items-center justify-center min-h-[48px] ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D]'}`}>
                <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#121212] text-white py-6 sm:py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2026 LE COIN BRICO. {t('footer.rights') || 'Tous droits réservés'}</p>
        </div>
      </footer>
    </div>
  );
}
