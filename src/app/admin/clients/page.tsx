"use client";

import { useState } from 'react';
import { Search, User, Phone, Mail, MapPin, ShoppingCart, Calendar, TrendingUp, Package, Eye, Filter } from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState([
    { 
      id: 1, 
      nom: 'Ahmed Benali', 
      email: 'ahmed.benali@email.com', 
      telephone: '0550 12 34 56', 
      wilaya: '16 - Alger', 
      commune: 'Bab Ezzouar',
      dateInscription: '2026-07-15',
      totalCommandes: 3,
      totalDepense: 42800,
      derniereCommande: '2026-08-24'
    },
    { 
      id: 2, 
      nom: 'Fatima Zahra', 
      email: 'fatima.zahra@email.com', 
      telephone: '0661 98 76 54', 
      wilaya: '31 - Oran', 
      commune: 'Es Senia',
      dateInscription: '2026-06-20',
      totalCommandes: 5,
      totalDepense: 78500,
      derniereCommande: '2026-08-23'
    },
    { 
      id: 3, 
      nom: 'Mohamed Ali', 
      email: 'mohamed.ali@email.com', 
      telephone: '0770 11 22 33', 
      wilaya: '25 - Constantine', 
      commune: 'El Khroub',
      dateInscription: '2026-05-10',
      totalCommandes: 8,
      totalDepense: 156000,
      derniereCommande: '2026-08-22'
    },
    { 
      id: 4, 
      nom: 'Sara Khelifi', 
      email: 'sara.khelifi@email.com', 
      telephone: '0555 44 55 66', 
      wilaya: '09 - Blida', 
      commune: 'Boufarik',
      dateInscription: '2026-08-01',
      totalCommandes: 2,
      totalDepense: 35400,
      derniereCommande: '2026-08-21'
    },
    { 
      id: 5, 
      nom: 'Karim Boudiaf', 
      email: 'karim.boudiaf@email.com', 
      telephone: '0660 77 88 99', 
      wilaya: '19 - Sétif', 
      commune: 'El Eulma',
      dateInscription: '2026-07-28',
      totalCommandes: 1,
      totalDepense: 8900,
      derniereCommande: '2026-08-20'
    },
    { 
      id: 6, 
      nom: 'Nadia Mansouri', 
      email: 'nadia.mansouri@email.com', 
      telephone: '0551 23 45 67', 
      wilaya: '42 - Tipaza', 
      commune: 'Cherchell',
      dateInscription: '2026-06-05',
      totalCommandes: 4,
      totalDepense: 62300,
      derniereCommande: '2026-08-18'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const filteredClients = clients.filter(client => 
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.includes(searchTerm)
  );

  const stats = {
    total: clients.length,
    nouveauxCeMois: clients.filter(c => new Date(c.dateInscription).getMonth() === new Date().getMonth()).length,
    meilleurClient: clients.reduce((prev, current) => (prev.totalDepense > current.totalDepense) ? prev : current),
    totalRevenus: clients.reduce((sum, c) => sum + c.totalDepense, 0)
  };

  const getHistoriqueCommandes = (clientId: number) => {
    const commandesParClient: Record<number, any[]> = {
      1: [
        { id: 1001, date: '2026-08-24', produit: 'Coffre-fort SAFE-100', montant: 15900, statut: 'En attente' },
        { id: 987, date: '2026-08-10', produit: 'Extracteur hydraulique', montant: 18900, statut: 'Livrée' },
        { id: 856, date: '2026-07-25', produit: 'Kit extracteur', montant: 8000, statut: 'Livrée' },
      ],
      2: [
        { id: 1002, date: '2026-08-23', produit: 'Extracteur hydraulique', montant: 18900, statut: 'Confirmée' },
        { id: 945, date: '2026-08-05', produit: 'Coffre-fort FIRE-200', montant: 28500, statut: 'Livrée' },
      ],
      3: [
        { id: 1003, date: '2026-08-22', produit: 'Coffre-fort FIRE-200 + Kit', montant: 44000, statut: 'Expédiée' },
      ],
    };
    return commandesParClient[clientId] || [];
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmée': return 'bg-blue-100 text-blue-800';
      case 'Expédiée': return 'bg-purple-100 text-purple-800';
      case 'Livrée': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#121212]">Gestion des Clients</h1>
        <p className="text-gray-600 mt-1">Consultez la base de données clients et leur historique</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-2xl font-bold text-[#121212]">{stats.total}</p>
            </div>
            <User className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Nouveaux ce mois</p>
              <p className="text-2xl font-bold text-green-600">{stats.nouveauxCeMois}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Meilleur Client</p>
              <p className="text-lg font-bold text-[#F7941D] truncate max-w-[150px]">{stats.meilleurClient?.nom.split(' ')[0]}</p>
            </div>
            <ShoppingCart className="text-orange-600" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenus Total</p>
              <p className="text-2xl font-bold text-[#121212]">{stats.totalRevenus.toLocaleString()} DA</p>
            </div>
            <Package className="text-purple-600" size={32} />
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#F7941D]"
          />
        </div>
      </div>

      {/* Liste des clients */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localisation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Dépensé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière Cmd</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F7941D] rounded-full flex items-center justify-center text-white font-bold">
                        {client.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#121212]">{client.nom}</p>
                        <p className="text-xs text-gray-500">Depuis {client.dateInscription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone size={12} /> {client.telephone}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail size={12} /> {client.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={12} /> {client.wilaya}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {client.totalCommandes} commandes
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#F7941D]">{client.totalDepense.toLocaleString()} DA</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{client.derniereCommande}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedClient(client)}
                      className="p-2 text-[#F7941D] hover:bg-orange-50 rounded-lg transition-colors"
                      title="Voir le profil"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center">
            <User className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">Aucun client trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Détails du client */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#121212]">Profil Client</h2>
              <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {/* En-tête du profil */}
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#F7941D] to-orange-500 p-6 rounded-xl text-white">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#F7941D] text-3xl font-bold">
                  {selectedClient.nom.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedClient.nom}</h3>
                  <p className="text-orange-100">Client depuis le {selectedClient.dateInscription}</p>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-[#121212] mb-3 flex items-center gap-2">
                    <User size={18} /> Informations Personnelles
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Téléphone</span>
                      <span className="font-medium flex items-center gap-1"><Phone size={14} /> {selectedClient.telephone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email</span>
                      <span className="font-medium flex items-center gap-1"><Mail size={14} /> {selectedClient.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Wilaya</span>
                      <span className="font-medium flex items-center gap-1"><MapPin size={14} /> {selectedClient.wilaya}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Commune</span>
                      <span className="font-medium">{selectedClient.commune}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-[#121212] mb-3 flex items-center gap-2">
                    <ShoppingCart size={18} /> Statistiques
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Commandes</span>
                      <span className="font-bold text-blue-600">{selectedClient.totalCommandes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Dépensé</span>
                      <span className="font-bold text-[#F7941D]">{selectedClient.totalDepense.toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Panier Moyen</span>
                      <span className="font-bold">{Math.round(selectedClient.totalDepense / selectedClient.totalCommandes).toLocaleString()} DA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Dernière Commande</span>
                      <span className="font-medium">{selectedClient.derniereCommande}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historique des commandes */}
              <div>
                <h4 className="font-bold text-[#121212] mb-3 flex items-center gap-2">
                  <Calendar size={18} /> Historique des Commandes
                </h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">N° Cmd</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Produit</th>
                        <th className="px-4 py-2 text-right">Montant</th>
                        <th className="px-4 py-2 text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getHistoriqueCommandes(selectedClient.id).map((cmd) => (
                        <tr key={cmd.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium">#{cmd.id}</td>
                          <td className="px-4 py-2 text-gray-600">{cmd.date}</td>
                          <td className="px-4 py-2">{cmd.produit}</td>
                          <td className="px-4 py-2 text-right font-bold text-[#F7941D]">{cmd.montant.toLocaleString()} DA</td>
                          <td className="px-4 py-2 text-center">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(cmd.statut)}`}>
                              {cmd.statut}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedClient(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Fermer
              </button>
              <button className="bg-[#F7941D] hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                <Phone size={18} />
                Contacter le client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}