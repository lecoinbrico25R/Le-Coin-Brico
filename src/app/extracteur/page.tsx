"use client";

import { Filter, Heart, Wrench, Zap, CircleDot, RotateCcw, Settings, Package } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export default function ExtracteurPage() {
  const { language, setLanguage, t } = useTranslation();

  const produits = [
    { 
      id: 1, 
      nom: 'Extracteur mécanique 2 mâchoires', 
      prix: 4500, 
      categorie: 'Mécanique', 
      marque: 'ProTool',
      image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=500&h=400&fit=crop'
    },
    { 
      id: 2, 
      nom: 'Extracteur hydraulique professionnel', 
      prix: 18900, 
      anciennePrix: 22000, 
      categorie: 'Hydraulique', 
      marque: 'HydroMax', 
      reduction: 14,
      image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=500&h=400&fit=crop'
    },
    { 
      id: 3, 
      nom: 'Extracteur de roulements 3 branches', 
      prix: 6800, 
      categorie: 'Roulements', 
      marque: 'BearTool',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=400&fit=crop'
    },
    { 
      id: 4, 
      nom: 'Extracteur à inertie universel', 
      prix: 8500, 
      categorie: 'Inertie', 
      marque: 'InertiaPro',
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&h=400&fit=crop'
    },
    { 
      id: 5, 
      nom: 'Extracteur de joints toriques', 
      prix: 3200, 
      categorie: 'Spécialisé', 
      marque: 'SealPro',
      image: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=500&h=400&fit=crop'
    },
    { 
      id: 6, 
      nom: 'Kit extracteur complet 15 pièces', 
      prix: 15500, 
      anciennePrix: 18000, 
      categorie: 'Kit', 
      marque: 'ProTool', 
      reduction: 14,
      image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=500&h=400&fit=crop'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="bg-[#121212] text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1">
              <img src="/images/logo.png" alt="LCB" className="w-full h-full object-contain" />
            </div>
            <div><h1 className="font-bold text-xl">LE COIN BRICO</h1><p className="text-xs text-gray-400">{t('footer.slogan')}</p></div>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="hover:text-[#F7941D]">{t('header.home')}</a>
            <a href="/coffres-forts" className="hover:text-[#F7941D]">{t('header.safes')}</a>
            <a href="/extracteur" className="text-[#F7941D] font-bold">{t('header.extractors')}</a>
            <a href="/contact" className="hover:text-[#F7941D]">{t('header.contact')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLanguage('fr')} className={`px-2 py-1 rounded text-sm ${language === 'fr' ? 'bg-[#F7941D] text-white' : 'text-gray-300'}`}>FR</button>
            <span className="text-gray-500">|</span>
            <button onClick={() => setLanguage('ar')} className={`px-2 py-1 rounded text-sm ${language === 'ar' ? 'bg-[#F7941D] text-white' : 'text-gray-300'}`}>عربي</button>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-[#121212] to-[#303030] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
            <Wrench size={48} className="text-[#F7941D]" />
            {t('header.extractors')}
          </h1>
          <p className="text-xl text-gray-300">Outils professionnels pour extraction de pièces mécaniques</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-[#121212] text-lg mb-4 flex items-center gap-2">
                <Filter size={20} className="text-[#F7941D]" /> {t('products.filters')}
              </h3>
              <div className="mb-6">
                <h4 className="font-semibold mb-3">{t('products.type')}</h4>
                <div className="space-y-2">
                  {['Mécanique', 'Hydraulique', 'Roulements', 'Inertie', 'Spécialisé', 'Kit'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-[#F7941D]" />
                      <span className="text-sm text-gray-600">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">{t('products.price')}</h4>
                <div className="space-y-2">
                  {['Moins de 5 000 DA', '5 000 - 10 000 DA', '10 000 - 20 000 DA', 'Plus de 20 000 DA'].map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="prix" className="text-[#F7941D]" />
                      <span className="text-sm text-gray-600">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <p className="text-gray-600"><strong>{produits.length}</strong> {t('products.found')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produits.map((produit) => (
                <div key={produit.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden relative">
                  {produit.reduction && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                      -{produit.reduction}%
                    </div>
                  )}
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1">{produit.marque}</p>
                    <h3 className="font-bold text-[#121212] mb-2">{produit.nom}</h3>
                    <p className="text-sm text-gray-600 mb-3">{produit.categorie}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-[#F7941D]">{produit.prix.toLocaleString()} DA</span>
                      {produit.anciennePrix && (
                        <span className="text-gray-400 line-through text-sm">{produit.anciennePrix.toLocaleString()} DA</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a href={`/produit/${produit.id}`} className="flex-1 bg-[#F7941D] hover:bg-orange-600 text-white font-semibold py-3 rounded-lg text-center">
                        {t('products.view')}
                      </a>
                      <button className="px-4 py-3 border border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D] rounded-lg">
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-[#121212] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2026 LE COIN BRICO. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
}