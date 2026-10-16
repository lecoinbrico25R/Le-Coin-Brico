"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Save, Loader2, CheckCircle, AlertCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function AdminParametres() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    hours: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setFormData({
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          hours: data.hours || ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      // On utilise upsert pour créer ou mettre à jour la ligne avec l'ID 1
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 1, ...formData }, { onConflict: 'id' });

      if (error) throw error;
      
      setMessage('Paramètres sauvegardés avec succès !');
      setMessageType('success');
      setTimeout(() => setMessage(''), 4000);
    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#F7941D]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Settings className="text-[#F7941D]" size={32} />
        <h1 className="text-3xl font-bold text-[#121212]">Paramètres du site</h1>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {messageType === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <h2 className="text-xl font-bold text-[#121212] border-b pb-4">Informations de contact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone size={16} className="text-[#F7941D]" /> Numéro de téléphone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent outline-none"
              placeholder="Ex: 0555 12 34 56"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail size={16} className="text-[#F7941D]" /> Adresse Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent outline-none"
              placeholder="contact@lecoinbrico.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-[#F7941D]" /> Adresse physique
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent outline-none"
              placeholder="Ex: 123 Rue Didouche Mourad, Alger"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock size={16} className="text-[#F7941D]" /> Horaires d'ouverture
            </label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => setFormData({...formData, hours: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F7941D] focus:border-transparent outline-none"
              placeholder="Ex: Sam - Jeu: 08h00 - 18h00"
            />
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#F7941D] hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
}
