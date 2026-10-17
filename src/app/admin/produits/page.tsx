"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Save, X, Package, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Product {
  id: number; name: string; name_ar?: string; description: string; description_ar?: string;
  price: number; category: string; image: string; images?: string[]; stock: number;
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
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '', name_ar: '', description: '', description_ar: '', price: '',
    category: 'coffres-forts', image: '', images: [] as string[], stock: ''
  });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg); setMessageType(type); setTimeout(() => setMessage(''), 4000);
  };

  const resetForm = () => {
    setFormData({ name: '', name_ar: '', description: '', description_ar: '', price: '', category: 'coffres-forts', image: '', images: [], stock: '' });
    setEditingId(null); setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name, name_ar: product.name_ar || '', description: product.description || '',
      description_ar: product.description_ar || '', price: product.price.toString(),
      category: product.category, image: product.image || '',
      images: Array.isArray(product.images) ? product.images : [],
      stock: product.stock.toString()
    });
    setEditingId(product.id); setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return showMessage('Image invalide', 'error');
    if (file.size > 5 * 1024 * 1024) return showMessage('Image trop lourde (max 5MB)', 'error');
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error } = await supabase.storage.from('products').upload(`products/${fileName}`, file);
      if (error) throw error;
      const { data } = supabase.storage.from('products').getPublicUrl(`products/${fileName}`);
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      showMessage('Image principale uploadée !', 'success');
    } catch (error: any) { showMessage(`Erreur : ${error.message}`, 'error'); } finally { setUploading(false); }
  };

  const handleMultipleImagesUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) continue;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${i}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from('products').upload(`products/${fileName}`, file);
        if (error) throw error;
        const { data } = supabase.storage.from('products').getPublicUrl(`products/${fileName}`);
        newUrls.push(data.publicUrl);
      }
      // ✅ Utiliser la forme fonctionnelle pour éviter les problèmes de state
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
      showMessage(`${newUrls.length} image(s) ajoutée(s) à la galerie !`, 'success');
    } catch (error: any) { showMessage(`Erreur : ${error.message}`, 'error'); } finally { setUploading(false); }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
    e.target.value = '';
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleMultipleImagesUpload(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSave = async () => {
    if (!formData.name || !formData.price) return showMessage('Nom et prix obligatoires', 'error');
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        images: Array.isArray(formData.images) ? formData.images : []
      };
      let error;
      if (editingId) {
        const res = await supabase.from('products').update(productData).eq('id', editingId);
        error = res.error;
      } else {
        const res = await supabase.from('products').insert([productData]);
        error = res.error;
      }
      if (error) throw error;
      showMessage(editingId ? 'Produit modifié !' : 'Produit ajouté !', 'success');
      resetForm(); loadProducts();
    } catch (error: any) { showMessage(`Erreur : ${error.message}`, 'error'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try { await supabase.from('products').delete().eq('id', id); showMessage('Supprimé !', 'success'); loadProducts(); } catch (error) { showMessage('Erreur', 'error'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#F7941D]" size={40} /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Package className="text-[#F7941D]" /> Gestion des Produits</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin')} className="px-4 py-2 border rounded-lg">Retour</button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-[#F7941D] text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus size={18} /> Ajouter</button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        {message && <div className={`mb-4 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
            <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">{editingId ? 'Modifier' : 'Ajouter'}</h2><button onClick={resetForm}><X /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nom (FR)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="p-2 border rounded" />
              <input type="text" placeholder="Nom (AR)" value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} className="p-2 border rounded" dir="rtl" />
              <input type="number" placeholder="Prix" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="p-2 border rounded" />
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="p-2 border rounded">
                <option value="coffres-forts">Coffres-forts</option>
                <option value="extracteur">Extracteur</option>
                <option value="postes-a-souder">Postes à souder</option>
                <option value="chargeur-batterie">Chargeur batterie</option>
              </select>
              <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="p-2 border rounded" />
              <div className="md:col-span-2 border-2 border-dashed p-6 text-center rounded cursor-pointer hover:border-[#F7941D]" onClick={() => fileInputRef.current?.click()}>
                {formData.image ? <img src={formData.image} className="h-40 mx-auto" /> : <p>Image principale (Cliquez ou glissez)</p>}
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} onDrop={handleDrop} onDragOver={handleDragOver} />
              </div>
              <div className="md:col-span-2 border-2 border-dashed p-4 text-center rounded cursor-pointer hover:border-[#F7941D]" onClick={() => multipleFileInputRef.current?.click()}>
                <ImageIcon className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Cliquez pour ajouter plusieurs photos (Galerie)</p>
                <p className="text-xs text-gray-500 mt-1">{formData.images.length} image(s) dans la galerie</p>
                <input ref={multipleFileInputRef} type="file" multiple className="hidden" onChange={handleMultipleFilesChange} accept="image/*" />
              </div>
              {formData.images.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium mb-2">Images de la galerie :</p>
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} className="h-24 w-full object-cover rounded border" />
                        <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <textarea placeholder="Description (FR)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="md:col-span-2 p-2 border rounded" rows={3} />
              <textarea placeholder="Description (AR)" value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} className="md:col-span-2 p-2 border rounded" rows={3} dir="rtl" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={resetForm} className="px-4 py-2 border rounded">Annuler</button>
              <button onClick={handleSave} className="bg-[#F7941D] text-white px-6 py-2 rounded flex items-center gap-2"><Save size={18} /> Enregistrer</button>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="p-4 text-left">ID</th><th className="p-4 text-left">Nom</th><th className="p-4 text-left">Catégorie</th><th className="p-4 text-left">Prix</th><th className="p-4 text-left">Photos</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4">#{p.id}</td>
                  <td className="p-4 font-bold">{p.name}</td>
                  <td className="p-4"><span className="bg-orange-100 text-[#F7941D] px-2 py-1 rounded text-xs">{p.category}</span></td>
                  <td className="p-4 font-bold">{p.price} DA</td>
                  <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{p.images?.length || 0} photo(s)</span></td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
