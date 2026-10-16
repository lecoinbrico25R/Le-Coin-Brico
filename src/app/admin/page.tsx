"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 1. Compter les produits
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: 0, // On met 0 par défaut si la table orders n'existe pas encore
        totalRevenue: 0,
        totalClients: 0
      });
    } catch (error) {
      console.error('Erreur stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#121212]">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-[#F7941D]" size={24} />
            <span className="text-gray-500">Produits</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="text-blue-500" size={24} />
            <span className="text-gray-500">Commandes</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-500" size={24} />
            <span className="text-gray-500">Chiffre d'affaires</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalRevenue} DA</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-purple-500" size={24} />
            <span className="text-gray-500">Clients</span>
          </div>
          <p className="text-3xl font-bold">{stats.totalClients}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-lg font-bold mb-4">Actions rapides</h2>
        <a href="/admin/produits" className="inline-block bg-[#F7941D] text-white px-4 py-2 rounded-lg hover:bg-orange-600">
          Ajouter un produit
        </a>
      </div>
    </div>
  );
}
