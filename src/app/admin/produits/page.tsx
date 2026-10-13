"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Save, X, Package } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

export default function AdminProduits() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffres-forts',
    image: '',
    stock: ''
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: 'coffres-forts', image: '', stock: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      image: product.image || '',
      stock: product.stock.toString()
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      showMessage('Le nom et le prix sont obligatoires', 'error');
      return;
    }
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        stock: parseInt(formData.stock) || 0
      };
      let error;
      if (editingId) {
        const result = await supabase.from('products').update(productData).eq('id', editingId);
        error = result.error;
      } else {
        const result = await supabase.from('products').insert([productData]);
        error = result.error;
      }
      if (error) throw error;
      showMessage(editingId ? 'Produit modifié !' : 'Produit ajouté !', 'success');
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      showMessage('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      showMessage('Produit supprimé !', 'success');
      loadProducts();
    } catch (error) {
      showMessage('Erreur lors de la suppression', 'error');
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Chargement...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="text-[#F7941D]" size={28} />
            <h1 className="text-2xl font-bold text-[#121212]">Gestion des Produits</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/admin')} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Retour</button>
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#F7941D] hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus size={18} /> Ajouter un produit
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#121212]">{editingId ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Ex: Coffre-fort mural 40L" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DA) *</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Ex: 45000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]">
                  <option value="coffres-forts">Coffres-forts</option>
                  <option value="extracteur">Extracteur</option>
                  <option value="postes-a-souder">Postes à souder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Ex: 10" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chemin de l'image</label>
                <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Ex: /images/produits/coffre-mural.jpg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Description du produit..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Annuler</button>
              <button onClick={handleSave} className="bg-[#F7941D] hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                <Save size={18} /> {editingId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-[#121212]">Liste des produits ({products.length})</h2>
          </div>
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Aucun produit trouvé.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{product.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#121212]">{product.name}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{product.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-[#F7941D]">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#121212]">{product.price.toLocaleString()} DA</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Modifier"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Supprimer"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}