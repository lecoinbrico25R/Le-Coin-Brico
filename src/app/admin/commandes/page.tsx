"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingCart, Mail, Trash2, Eye, Loader2 } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminCommandes() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#121212]">Messages reçus</h1>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Mail className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">Aucun message reçu pour le moment.</p>
          <p className="text-sm text-gray-400 mt-2">Les messages du formulaire de contact apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-bold text-[#121212]">
              {messages.length} message{messages.length > 1 ? 's' : ''} reçu{messages.length > 1 ? 's' : ''}
            </h2>
          </div>
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
                        {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {msg.subject && (
                      <p className="font-medium text-gray-700 mb-2">Sujet : {msg.subject}</p>
                    )}
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{msg.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Voir"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal pour voir le message en détail */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedMessage.name}</h2>
                <p className="text-gray-500">{selectedMessage.email}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {selectedMessage.subject && (
              <p className="font-medium mb-2">Sujet : {selectedMessage.subject}</p>
            )}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <p className="text-sm text-gray-400">
              Reçu le {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
