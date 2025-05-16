'use client';

import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useOrderStore } from '@/store/orderStore';
import { useLabStore } from '@/store/labStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { useSession } from 'next-auth/react';
import { Order } from '@/types';
import toast from 'react-hot-toast';

type OrderTab = 'to-validate' | 'to-deliver' | 'history';

export default function OrdersPage() {
  const { data: session } = useSession();
  const { orders, updateOrderStatus, setExpectedDeliveryDate, markAsDelivered } = useOrderStore();
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  
  const [activeTab, setActiveTab] = useState<OrderTab>('to-validate');
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [deliveryDates, setDeliveryDates] = useState<Record<string, string>>({});
  
  // Filtres
  const [selectedLabId, setSelectedLabId] = useState<string>('all');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>('all');
  
  // Comptage des commandes par catégorie pour les badges
  const pendingCount = orders.filter(order => order.status === 'pending').length;
  const awaitingDeliveryCount = orders.filter(order => order.status === 'awaiting_delivery').length;
  
  // Commandes filtrées selon l'onglet actif et les filtres sélectionnés
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filtre par statut selon l'onglet
      const statusFilter = 
        activeTab === 'to-validate' ? order.status === 'pending' :
        activeTab === 'to-deliver' ? order.status === 'awaiting_delivery' :
        (order.status === 'delivered' || order.status === 'rejected');
        
      // Filtre par laboratoire
      const labFilter = selectedLabId === 'all' || order.labId === selectedLabId;
      
      // Filtre par pharmacie
      const pharmacyFilter = selectedPharmacyId === 'all' || order.pharmacyId === selectedPharmacyId;
      
      return statusFilter && labFilter && pharmacyFilter;
    }).sort((a, b) => {
      // Tri par date (le plus récent d'abord)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, activeTab, selectedLabId, selectedPharmacyId]);
  
  // Obtenir le nom du laboratoire
  const getLabName = (id: string) => {
    const lab = labs.find(l => l.id === id);
    return lab?.name || 'Laboratoire inconnu';
  };
  
  // Obtenir le nom de la pharmacie
  const getPharmacyName = (id: string) => {
    // Chercher dans le store
    const pharmacy = pharmacies.find(p => p.id === id);
    if (pharmacy) return pharmacy.name;
    
    // Fallback pour les IDs NextAuth
    const fixedIds: Record<string, string> = {
      "pharmacy-1": "Pharmacie Centrale",
      "pharmacy-2": "Pharmacie du Port",
      "pharmacy-3": "Pharmacie des Alpes",
      "pharmacy-4": "Pharmacie de la Gare",
      "pharmacy-5": "Pharmacie de l'Étoile"
    };
    
    return fixedIds[id] || `Pharmacie ${id.slice(0, 5)}`;
  };
  
  // Formatage de date simple
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };
  
  // Actions sur les commandes
  const handleApprove = (order: Order) => {
    setProcessingOrderId(order.id);
    setTimeout(() => {
      updateOrderStatus(
        order.id, 
        'approved',
        session?.user?.name || 'Utilisateur'
      );
      toast.success('Commande approuvée');
      setProcessingOrderId(null);
      
      // Définir une date de livraison par défaut (+7 jours)
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setDeliveryDates(prev => ({
        ...prev,
        [order.id]: defaultDate.toISOString().split('T')[0]
      }));
    }, 500);
  };
  
  const handleReject = (order: Order) => {
    setProcessingOrderId(order.id);
    setTimeout(() => {
      updateOrderStatus(
        order.id, 
        'rejected',
        session?.user?.name || 'Utilisateur'
      );
      toast.success('Commande rejetée');
      setProcessingOrderId(null);
    }, 500);
  };
  
  const handleDeliveryDateChange = (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDates(prev => ({
      ...prev,
      [orderId]: e.target.value
    }));
  };
  
  const handleSetDeliveryDate = (order: Order) => {
    if (!deliveryDates[order.id]) return;
    
    setProcessingOrderId(order.id);
    setTimeout(() => {
      setExpectedDeliveryDate(order.id, new Date(deliveryDates[order.id]));
      toast.success('Date de livraison définie');
      setProcessingOrderId(null);
    }, 500);
  };
  
  const handleMarkDelivered = (order: Order) => {
    setProcessingOrderId(order.id);
    setTimeout(() => {
      markAsDelivered(order.id);
      toast.success('Commande marquée comme livrée');
      setProcessingOrderId(null);
    }, 500);
  };
  
  // Rendu du badge de statut
  const renderStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      awaiting_delivery: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      delivered: 'bg-purple-100 text-purple-800'
    };
    
    const labels = {
      pending: 'En attente',
      approved: 'Approuvée',
      awaiting_delivery: 'Livraison programmée',
      rejected: 'Rejetée',
      delivered: 'Livrée'
    };
    
    const style = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    const label = labels[status as keyof typeof labels] || status;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {label}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Gestion des commandes</h2>
          
          {/* Onglets */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`py-2 px-4 font-medium text-sm relative ${
                activeTab === 'to-validate'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('to-validate')}
            >
              Commandes à valider
              {pendingCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
            
            <button
              className={`py-2 px-4 font-medium text-sm relative ${
                activeTab === 'to-deliver'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('to-deliver')}
            >
              Commandes à livrer
              {awaitingDeliveryCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {awaitingDeliveryCount}
                </span>
              )}
            </button>
            
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Historique
            </button>
          </div>
          
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="text-sm text-gray-600">
              {filteredOrders.length} commande(s) trouvée(s)
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select
                options={[
                  { value: 'all', label: 'Tous les laboratoires' },
                  ...labs.map(lab => ({ value: lab.id, label: lab.name }))
                ]}
                value={selectedLabId}
                onChange={(value) => setSelectedLabId(value)}
                className="min-w-[180px]"
              />
              
              <Select
                options={[
                  { value: 'all', label: 'Toutes les pharmacies' },
                  ...pharmacies.map(pharmacy => ({ value: pharmacy.id, label: pharmacy.name }))
                ]}
                value={selectedPharmacyId}
                onChange={(value) => setSelectedPharmacyId(value)}
                className="min-w-[180px]"
              />
            </div>
          </div>
          
          {/* Contenu des onglets */}
          {filteredOrders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                {activeTab === 'to-validate'
                  ? 'Aucune commande en attente de validation'
                  : activeTab === 'to-deliver'
                  ? 'Aucune commande en attente de livraison'
                  : 'Aucune commande dans l\'historique'}
                {(selectedLabId !== 'all' || selectedPharmacyId !== 'all') && 
                  ' avec les filtres sélectionnés'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-grow mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStatusBadge(order.status)}
                        <h3 className="text-lg font-medium">{order.fileName}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Laboratoire</p>
                          <p className="text-sm font-medium">{getLabName(order.labId)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Pharmacie</p>
                          <p className="text-sm font-medium">{getPharmacyName(order.pharmacyId)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Contenu</p>
                          <p className="text-sm font-medium">{order.referencesCount} réf., {order.boxesCount} boîtes</p>
                        </div>
                      </div>
                      
                      {order.expectedDeliveryDate && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Livraison prévue</p>
                          <p className="text-sm font-medium">{formatDate(order.expectedDeliveryDate)}</p>
                        </div>
                      )}
                      
                      {order.deliveredAt && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Livrée le</p>
                          <p className="text-sm font-medium">{formatDate(order.deliveredAt)}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 md:items-end">
                      {/* Commandes à valider */}
                      {order.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleReject(order)}
                            disabled={processingOrderId === order.id}
                            loading={processingOrderId === order.id}
                          >
                            Rejeter
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(order)}
                            disabled={processingOrderId === order.id}
                            loading={processingOrderId === order.id}
                          >
                            Approuver
                          </Button>
                        </div>
                      )}
                      
                      {/* Commandes à livrer */}
                      {order.status === 'awaiting_delivery' && (
                        <>
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              className="border border-gray-300 rounded text-sm p-1"
                              value={deliveryDates[order.id] || ''}
                              onChange={e => handleDeliveryDateChange(order.id, e)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDeliveryDate(order)}
                              disabled={!deliveryDates[order.id] || processingOrderId === order.id}
                            >
                              Définir
                            </Button>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleMarkDelivered(order)}
                            disabled={processingOrderId === order.id}
                            loading={processingOrderId === order.id}
                          >
                            Marquer livrée
                          </Button>
                        </>
                      )}
                      
                      {/* Commandes historiques */}
                      {(order.status === 'delivered' || order.status === 'rejected') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Téléchargement du fichier CSV
                            const blob = new Blob([order.rawContent], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = order.fileName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                        >
                          Télécharger
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}