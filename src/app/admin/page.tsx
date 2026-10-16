"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react';

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

      // 2. Compter les commandes (si la table existe, sinon on met 0)
      let ordersCount = 0;
      let revenue = 0;
      try {
        const { count, data } = await supabase
          .from('orders')
          .select('total_amount', { count: 'exact', head: false });
        
        ordersCount = count || 0;
        if (data) {
          revenue = data.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        }
      } catch (e) {
        // La table orders n'existe pas encore, on ignore l'erreur
        console.log('Table orders non trouvée, stats mises à 0');
      }

      // 3. Compter les clients (utilisateurs ou commandes uniques)
      const { count: clientsCount } = await supabase
        .from('orders')
        .select('client_name', { count: 'exact', head: true })
        .throwOnError(false); // Ignore l'erreur si la table n'existe pas

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount,
        totalRevenue: revenue,
        totalClients: clientsCount || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      label: 'En catalogue'
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-[#F7941D]',
      label: 'Total'
    },
    {
      title: 'Chiffre d\'affaires',
      value: `${stats.totalRevenue.toLocaleString()} DA`,
      icon: DollarSign,
      color: 'bg-green-500',
      label: 'Cumulé'
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-purple-500',
      label: 'Uniques'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7941D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#121212]">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border">
          <TrendingUp size={16} className="text-green-500" />
          <span>Dernière mise à jour : à l'instant</span>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#121212] mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Section Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#121212] mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/produits" className="px-4 py-2 bg-[#F7941D] text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Package size={18} /> Ajouter un produit
          </a>
          <a href="/admin/commandes" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <ShoppingCart size={18} /> Voir les commandes
          </a>
        </div>
      </div>
    </div>
  );
}
