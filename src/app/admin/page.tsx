"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Package, Users, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    clients: 0,
    revenue: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { data: orders } = await supabase
        .from('orders')
        .select('product_price, quantity');

      const revenue = orders?.reduce((sum, o) => sum + (o.product_price * o.quantity), 0) || 0;

      setStats({
        orders: ordersCount || 0,
        products: productsCount || 0,
        clients: 0,
        revenue
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const statCards = [
    { title: 'Commandes', value: stats.orders, icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Produits', value: stats.products, icon: Package, color: 'bg-green-500' },
    { title: 'Clients', value: stats.clients, icon: Users, color: 'bg-purple-500' },
    { title: 'Revenus', value: `${stats.revenue.toLocaleString()} DA`, icon: TrendingUp, color: 'bg-[#F7941D]' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#121212] mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-[#121212]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#121212] mb-4">Bienvenue sur votre panneau d'administration</h2>
        <p className="text-gray-600">Utilisez le menu de gauche pour gérer vos produits, commandes et paramètres.</p>
      </div>
    </div>
  );
}
