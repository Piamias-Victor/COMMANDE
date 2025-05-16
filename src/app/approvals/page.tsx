'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LabSelector } from '@/components/features/LabSelector';
import { useLabStore } from '@/store/labStore';
import { useOrderStore } from '@/store/orderStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { Order } from '@/types';

export default function ApprovalsPage() {
  const { data: session } = useSession();
  const { labs, selectedLabId } = useLabStore();
  const { orders, updateOrderStatus, setExpectedDeliveryDate, markAsDelivered } = useOrderStore();
  const { pharmacies } = usePharmacyStore();
  
  const [deliveryDates, setDeliveryDates] = useState<Record<string, string>>({});
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);

  // Get pharmacy name from ID
  const getPharmacyName = (id: string) => {
    // Try to find in pharmacies store
    const pharmacy = pharmacies.find(p => p.id === id);
    if (pharmacy) return pharmacy.name;
    
    // Fixed mapping for NextAuth IDs
    const fixedIdMapping: Record<string, string> = {
      "pharmacy-1": "Pharmacie Centrale",
      "pharmacy-2": "Pharmacie du Port",
      "pharmacy-3": "Pharmacie des Alpes",
      "pharmacy-4": "Pharmacie de la Gare",
      "pharmacy-5": "Pharmacie de l'Étoile"
    };
    
    return fixedIdMapping[id] || 'Pharmacie inconnue';
  };

  // Filtered orders based on selected lab and processing state
  const filteredOrders = useMemo(() => {
    if (!selectedLabId) return [];
    
    return orders.filter(order => {
      // Filter by selected lab
      if (order.labId !== selectedLabId) return false;
      
      // Filter by processing state
      if (showProcessed) {
        // Show approved, awaiting_delivery, delivered, rejected
        return order.status !== 'pending';
      } else {
        // Show only pending and awaiting_delivery
        return order.status === 'pending' || order.status === 'awaiting_delivery';
      }
    }).sort((a, b) => {
      // Sort by status first (pending at top, then awaiting_delivery)
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      
      // Then sort by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, selectedLabId, showProcessed]);

  // Get lab name from ID
  const getLabName = (id: string) => {
    const lab = labs.find(lab => lab.id === id);
    return lab ? lab.name : 'Laboratoire inconnu';
  };

  // Handle status change
  const handleStatusChange = async (order: Order, newStatus: 'approved' | 'rejected') => {
    setProcessingOrderId(order.id);
    
    try {
      updateOrderStatus(
        order.id,
        newStatus,
        session?.user?.name || undefined
      );
      
      toast.success(`Commande ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}`);
      
      // If approved, set default delivery date to +7 days
      if (newStatus === 'approved') {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        
        setDeliveryDates(prev => ({
          ...prev,
          [order.id]: format(defaultDate, 'yyyy-MM-dd')
        }));
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Handle delivery date change
  const handleDeliveryDateChange = (orderId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDates(prev => ({
      ...prev,
      [orderId]: event.target.value
    }));
  };

  // Handle set delivery date
  const handleSetDeliveryDate = async (orderId: string) => {
    setProcessingOrderId(orderId);
    
    try {
      const dateStr = deliveryDates[orderId];
      if (!dateStr) {
        toast.error("Veuillez sélectionner une date");
        return;
      }
      
      const deliveryDate = new Date(dateStr);
      setExpectedDeliveryDate(orderId, deliveryDate);
      
      toast.success("Date de livraison définie");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Handle mark as delivered
  const handleMarkDelivered = async (orderId: string) => {
    setProcessingOrderId(orderId);
    
    try {
      markAsDelivered(orderId);
      toast.success("Commande marquée comme livrée");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      awaiting_delivery: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
    };
    
    const statusLabels = {
      pending: 'En attente',
      approved: 'Approuvée',
      awaiting_delivery: 'Livraison programmée',
      rejected: 'Rejetée',
      delivered: 'Livrée'
    };
    
    const style = statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
    const label = statusLabels[status as keyof typeof statusLabels] || status;
    
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
          <h2 className="text-2xl font-bold mb-4">Approbations des commandes</h2>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Sélectionnez un laboratoire pour visualiser et gérer les commandes associées.
            </p>
            
            <LabSelector />
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showProcessed"
                checked={showProcessed}
                onChange={() => setShowProcessed(!showProcessed)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="showProcessed" className="text-sm text-gray-700 dark:text-gray-300">
                {showProcessed ? 'Afficher toutes les commandes' : 'Afficher seulement les commandes à traiter'}
              </label>
            </div>
          </div>
          
          {!selectedLabId ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Veuillez sélectionner un laboratoire pour voir les commandes
                </p>
              </div>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {showProcessed 
                    ? "Aucune commande traitée pour ce laboratoire"
                    : "Aucune commande en attente pour ce laboratoire"}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <Card key={order.id} className="p-4 relative">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        {renderStatusBadge(order.status)}
                        <h3 className="text-lg font-medium">{order.fileName}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Pharmacie</p>
                          <p className="font-medium">{getPharmacyName(order.pharmacyId)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                          <p className="font-medium">
                            {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: fr })}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contenu</p>
                          <p className="font-medium">
                            {order.referencesCount} références, {order.boxesCount} boîtes
                          </p>
                        </div>
                      </div>
                      
                      {/* Expected or delivered date if available */}
                      {(order.expectedDeliveryDate || order.deliveredAt) && (
                        <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          {order.deliveredAt ? (
                            <p className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Livrée le:</span>{' '}
                              <span className="font-medium">
                                {format(new Date(order.deliveredAt), 'dd MMMM yyyy', { locale: fr })}
                              </span>
                            </p>
                          ) : order.expectedDeliveryDate ? (
                            <p className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Livraison prévue:</span>{' '}
                              <span className="font-medium">
                                {format(new Date(order.expectedDeliveryDate), 'dd MMMM yyyy', { locale: fr })}
                              </span>
                            </p>
                          ) : null}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-start space-y-2">
                      {/* Actions based on status */}
                      {order.status === 'pending' && (
                        <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 w-full">
                          <Button
                            variant="primary"
                            onClick={() => handleStatusChange(order, 'approved')}
                            disabled={processingOrderId === order.id}
                            loading={processingOrderId === order.id && order.status === 'pending'}
                            className="flex-1"
                          >
                            Approuver
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusChange(order, 'rejected')}
                            disabled={processingOrderId === order.id}
                            loading={processingOrderId === order.id && order.status === 'pending'}
                            className="flex-1"
                          >
                            Rejeter
                          </Button>
                        </div>
                      )}
                      
                      {order.status === 'awaiting_delivery' && (
                        <div className="flex flex-col space-y-2 w-full">
                          <div className="flex items-center space-x-2">
                            <input
                              type="date"
                              value={deliveryDates[order.id] || ''}
                              onChange={(e) => handleDeliveryDateChange(order.id, e)}
                              className="p-2 border border-gray-300 rounded text-sm w-full"
                              min={format(new Date(), 'yyyy-MM-dd')}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDeliveryDate(order.id)}
                              disabled={processingOrderId === order.id || !deliveryDates[order.id]}
                              loading={processingOrderId === order.id}
                            >
                              Définir
                            </Button>
                          </div>
                          
                          <Button
                            variant="primary"
                            onClick={() => handleMarkDelivered(order.id)}
                            disabled={processingOrderId === order.id}
                            loading={processingOrderId === order.id}
                          >
                            Marquer livrée
                          </Button>
                        </div>
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