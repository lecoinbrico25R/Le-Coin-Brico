
"use client";

import { useState, useEffect } from 'react';
import { Save, Phone, Mail, MapPin, Clock, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminParametres() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({
    phone: '0550 12 34 56',
    email: 'le.coin.brico25@gmail.com',
    address: '123 Rue Didouche Mourad, Alger Centre, Algérie',
    opening_hours: 'Dim - Jeu : 9h - 18h, Vendredi : Fermé, Samedi : 9h - 13h'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('Tentative de connexion à Supabase...');
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      console.log('Réponse Supabase - Data:', data);
      console.log('Réponse Supabase - Error:', error);

      if (error) {
        console.error('Erreur Supabase:', error.message);
        throw error;
      }
      
      if (data) {
        setSettings({
          phone: data.phone || settings.phone,
          email: data.email || settings.email,
          address: data.address || settings.address,
          opening_hours: data.opening_hours || settings.opening_hours
        });
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      console.error('Message:', error.message);
      alert('Erreur: ' + (error.message || 'Inconnue'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('site_settings')
        .update({
          phone: settings.phone,
          email: settings.email,
          address: settings.address,
          opening_hours: settings.opening_hours,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#121212]">Paramètres du Site</h1>
        <p className="text-gray-600 mt-1">Gérez les informations de contact et les horaires</p>
      </div>

      {/* Succès */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="text-green-600" size={20} />
          <p className="text-green-800 font-medium">Paramètres sauvegardés avec succès !</p>
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Téléphone */}
          <div>
            <label className="block text-sm font-bold text-[#121212] mb-2">
              <Phone size={16} className="inline mr-1" /> Téléphone principal *
            </label>
            <input
              type="text"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#F7941D]"
              placeholder="0550 12 34 56"
            />
            <p className="text-xs text-gray-500 mt-1">Ce numéro apparaîtra sur le site et dans le footer</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[#121212] mb-2">
              <Mail size={16} className="inline mr-1" /> Adresse Email *
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#F7941D]"
              placeholder="le.coin.brico25@gmail.com"
            />
            <p className="text-xs text-gray-500 mt-1">Email de contact affiché sur le site</p>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-bold text-[#121212] mb-2">
              <MapPin size={16} className="inline mr-1" /> Adresse complète *
            </label>
            <textarea
              name="address"
              value={settings.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#F7941D]"
              placeholder="123 Rue Didouche Mourad, Alger Centre, Algérie"
            />
            <p className="text-xs text-gray-500 mt-1">L'adresse de votre magasin/local</p>
          </div>

          {/* Horaires */}
          <div>
            <label className="block text-sm font-bold text-[#121212] mb-2">
              <Clock size={16} className="inline mr-1" /> Horaires d'ouverture *
            </label>
            <textarea
              name="opening_hours"
              value={settings.opening_hours}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#F7941D]"
              placeholder="Dim - Jeu : 9h - 18h, Vendredi : Fermé, Samedi : 9h - 13h"
            />
            <p className="text-xs text-gray-500 mt-1">Vos heures d'ouverture (séparez les jours par des virgules)</p>
          </div>

          {/* Bouton sauvegarder */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={loadSettings}
              className="px-6 py-3 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F7941D] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>

      {/* Informations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-bold text-blue-800 mb-1">💡 Information</h3>
            <p className="text-sm text-blue-700">
              Les modifications que vous apportez ici seront automatiquement appliquées sur tout le site. 
              Le numéro de téléphone et l'email seront visibles dans le footer et la page de contact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}