"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, MessageCircle, ShoppingCart, X } from 'lucide-react';
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

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    quantity: '1',
    notes: ''
  });

  useEffect(() => {
    if (params.id) {
      loadProduct(Number(params.id));
    }
  }, [params.id]);

  const loadProduct = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Erreur chargement produit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (product) {
      const message = `Bonjour, je suis intéressé par le produit : ${product.name} (Prix: ${product.price} DA)`;
      const whatsappUrl = `https://wa.me/213560143657?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleOrderSubmit = async () => {
    if (!formData.customer_name || !formData.customer_phone || !formData.customer_address) {
      setMessage('Veuillez remplir tous les champs obligatoires');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!product) return;

    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          customer_name: formData.customer_name,
          customer_phone: formData.customer_phone,
          customer_address: formData.customer_address,
          quantity: parseInt(formData.quantity) || 1,
          notes: formData.notes
        }]);

      if (error) throw error;

      setMessage('Commande envoyée avec succès ! Nous vous contacterons bientôt.');
      setMessageType('success');
      setShowForm(false);
      setFormData({ customer_name: '', customer_phone: '', customer_address: '', quantity: '1', notes: '' });
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Erreur envoi commande:', error);
      setMessage('Erreur lors de l\'envoi de la commande');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Produit non trouvé.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-600 hover:text-[#F7941D] mb-8">
          <ArrowLeft size={20} /> Retour
        </button>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12">
            <div className="h-96 bg-gray-100 rounded-xl overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">Pas d'image</div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-orange-100 text-[#F7941D] text-sm rounded-full mb-4 w-fit">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[#121212] mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-[#F7941D] mb-6">{product.price.toLocaleString()} DA</p>
              
              <div className="mb-8">
                <h3 className="font-bold text-[#121212] mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description || "Aucune description disponible."}</p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-green-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={20} />
                  Commander sur WhatsApp
                </button>

                <button 
                  onClick={() => setShowForm(true)}
                  className="w-full bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart size={20} />
                  Commander via le formulaire
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Rupture de stock"}
              </p>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#121212]">Formulaire de commande</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="0560 14 36 57"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison *</label>
                  <textarea
                    value={formData.customer_address}
                    onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="Votre adresse complète"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]"
                    placeholder="Instructions spéciales..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleOrderSubmit}
                    className="flex-1 bg-[#F7941D] hover:bg-orange-600 text-white font-bold py-3 rounded-lg"
                  >
                    Envoyer la commande
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}