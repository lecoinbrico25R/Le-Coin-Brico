"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Save, X, Package, Upload } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    description: '',
    description_ar: '',
    price: '',
    category: 'coffres-forts',
    image: '',
    stock: ''
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
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
    setTimeout(() => setMessage(''), 4000);
  };

  const resetForm = () => {
    setFormData({ name: '', name_ar: '', description: '', description_ar: '', price: '', category: 'coffres-forts', image: '', stock: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      name_ar: product.name_ar || '',
      description: product.description || '',
      description_ar: product.description_ar || '',
      price: product.price.toString(),
      category: product.category,
      image: product.image || '',
      stock: product.stock.toString()
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    console.log("Tentative d'upload du fichier :", file.name, file.size);
    
    if (!file.type.startsWith('image/')) {
      showMessage('Veuillez sélectionner une image valide (JPG, PNG)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('L\'image ne doit pas dépasser 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Erreur Supabase Upload:", uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage.from('products').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image: urlData.publicUrl }));
      showMessage('Image uploadée avec succès !', 'success');
    } catch (error: any) {
      console.error('Erreur détaillée upload image:', error);
      showMessage(`Erreur upload : ${error.message || 'Vérifiez que le bucket "products" existe et est public dans Supabase'}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    // Reset input value to allow selecting the same file again if needed
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      showMessage('Le nom et le prix sont obligatoires', 'error');
      return;
    }
    try {
      const productData = {
        name: formData.name,
        name_ar: formData.name_ar,
        description: formData.description,
        description_ar: formData.description_ar,
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
      
      showMessage(editingId ? 'Produit modifié avec succès !' : 'Produit ajouté avec succès !', 'success');
      resetForm();
      loadProducts();
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      showMessage(`Erreur : ${error.message}`, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit définitivement ?')) return;
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
          <div className={`mb-4 p-4 rounded-lg font-medium ${messageType === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#121212]">{editingId ? 'Modifier le produit' : 'Ajouter un nouveau produit'}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit (Français) *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Ex: Coffre-fort mural 40L" />
              </div>
              <div dir="rtl">
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (بالعربية)</label>
                <input type="text" value={formData.name_ar} onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="مثال: خزنة حائط 40 لتر" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (DA) *</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Ex: 45000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]">
                  <option value="coffres-forts">Coffres-forts</option>
                  <option value="extracteur">Extracteur d'air</option>
                  <option value="postes-a-souder">Postes à souder</option>
                  <option value="chargeur-batterie">Chargeur de batterie</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Ex: 10" />
              </div>
              
              {/* ZONE D'UPLOAD AMÉLIORÉE */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F7941D] hover:bg-orange-50 transition-all cursor-pointer group"
                >
                  {formData.image ? (
                    <div className="space-y-3">
                      <img src={formData.image} alt="Aperçu" className="mx-auto max-h-48 rounded-lg shadow-sm" />
                      <p className="text-sm text-[#F7941D] font-medium">Cliquez ou glissez une nouvelle image pour la remplacer</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="mx-auto text-gray-400 group-hover:text-[#F7941D] transition-colors" size={48} />
                      <p className="text-gray-600 font-medium">Glissez-déposez une image ici ou cliquez pour sélectionner</p>
                      <p className="text-xs text-gray-400">PNG, JPG jusqu'à 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {uploading && <p className="text-sm text-[#F7941D] mt-2 font-medium animate-pulse">⏳ Upload en cours...</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Français)</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="Description du produit..." />
              </div>
              <div className="md:col-span-2" dir="rtl">
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (بالعربية)</label>
                <textarea value={formData.description_ar} onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7941D]" placeholder="وصف المنتج..." />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button onClick={resetForm} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium">Annuler</button>
              <button onClick={handleSave} className="bg-[#F7941D] hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium">
                <Save size={18} /> {editingId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-[#121212]">Liste des produits ({products.length})</h2>
          </div>
          {products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Package className="mx-auto mb-3 text-gray-300" size={48} />
              <p>Aucun produit trouvé. Commencez par en ajouter un !</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Prix</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">#{product.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-[#121212]">{product.name}</div>
                        {product.name_ar && <div className="text-xs text-gray-500 mt-1" dir="rtl">{product.name_ar}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-[#F7941D] border border-orange-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#121212]">{product.price.toLocaleString()} DA</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Modifier"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer"><Trash2 size={18} /></button>
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
