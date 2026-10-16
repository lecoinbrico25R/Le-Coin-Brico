"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Mail, Trash2, Eye, Loader2, Package, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Order {
  id: number;
  client_name: string;
  client_phone: string;
  client_email: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
  products: any[];
  total: number;
  status: string;
  created_at: string;
}

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminCommandes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'messages'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: ordersData }, { data: messagesData }] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: false })
      ]);
      setOrders(ordersData || []);
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (!confirm('Supprimer cette commande ?')) return;
    try {
      await supabase.from('orders').delete().eq('id', id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (error) { console.error(error); }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await supabase.from('messages').delete().eq('id', id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (error) { console.error(error); }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Livrée' || status === 'Confirmée') return <CheckCircle size={16} className="text-green-500" />;
    if (status === 'Annulée') return <XCircle size={16} className="text-red-500" />;
    return <Clock size={16} className="text-orange-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#F7941D]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#121212]">Gestion des interactions</h1>

      {/* Onglets */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'orders' ? 'text-[#F7941D] border-b-2 border-[#F7941D]' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingCart size={20} /> Commandes ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-6 py-3 font-medium flex items-center gap-2 transition-colors ${
            activeTab === 'messages' ? 'text-[#F7941D] border-b-2 border-[#F7941D]' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mail size={20} /> Messages ({messages.length})
        </button>
      </div>

      {/* Contenu Onglet Commandes */}
      {activeTab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <Package className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Aucune commande reçue pour le moment.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Téléphone</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Wilaya</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">#{order.id}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-[#121212]">{order.client_name}</div>
                          <div className="text-xs text-gray-500">{order.client_email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">{order.client_phone}</td>
                        <td className="px-6 py-4 text-sm">{order.wilaya}</td>
                        <td className="px-6 py-4 text-sm font-bold text-[#F7941D]">{order.total?.toLocaleString()} DA</td>
                        <td className="px-6 py-4 text-sm flex items-center gap-2">
                          {getStatusIcon(order.status)} {order.status}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={18} /></button>
                            <button onClick={() => handleDeleteOrder(order.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenu Onglet Messages */}
      {activeTab === 'messages' && (
        <div>
          {messages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <Mail className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">Aucun message reçu pour le moment.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="divide-y divide-gray-200">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-[#F7941D] rounded-full flex items-center justify-center text-white font-bold">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#121212]">{msg.name}</h3>
                            <p className="text-sm text-gray-500">{msg.email}</p>
                          </div>
                          <span className="text-xs text-gray-400 ml-auto">
                            {new Date(msg.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {msg.subject && <p className="font-medium text-gray-700 mb-2">Sujet : {msg.subject}</p>}
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{msg.message}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedMessage(msg)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={18} /></button>
                        <button onClick={() => handleDeleteMessage(msg.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Détail Commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Commande #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
              <div><p className="text-xs text-gray-500">Client</p><p className="font-bold">{selectedOrder.client_name}</p></div>
              <div><p className="text-xs text-gray-500">Téléphone</p><p className="font-bold">{selectedOrder.client_phone}</p></div>
              <div><p className="text-xs text-gray-500">Wilaya / Commune</p><p className="font-bold">{selectedOrder.wilaya}, {selectedOrder.commune}</p></div>
              <div><p className="text-xs text-gray-500">Adresse</p><p className="font-bold">{selectedOrder.address}</p></div>
            </div>
            <h3 className="font-bold mb-2">Produits commandés :</h3>
            <div className="border rounded-lg divide-y mb-4">
              {selectedOrder.products?.map((p: any, i: number) => (
                <div key={i} className="p-3 flex justify-between items-center">
                  <span>{p.name} x {p.quantity}</span>
                  <span className="font-bold">{(p.price * p.quantity).toLocaleString()} DA</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
              <span>Total</span>
              <span className="text-[#F7941D]">{selectedOrder.total?.toLocaleString()} DA</span>
            </div>
            {selectedOrder.notes && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm font-bold text-yellow-800">Notes :</p>
                <p className="text-sm text-yellow-700">{selectedOrder.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Détail Message */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedMessage.name}</h2>
                <p className="text-gray-500">{selectedMessage.email}</p>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
            </div>
            {selectedMessage.subject && <p className="font-medium mb-2">Sujet : {selectedMessage.subject}</p>}
            <div className="bg-gray-50 p-4 rounded-lg mb-4"><p className="whitespace-pre-wrap">{selectedMessage.message}</p></div>
            <p className="text-sm text-gray-400">Reçu le {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
