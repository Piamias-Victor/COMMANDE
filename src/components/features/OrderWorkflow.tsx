import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useOrderStore } from '@/store/orderStore';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface OrderWorkflowProps {
  order: Order;
  onUpdate?: () => void;
}

export const OrderWorkflow: React.FC<OrderWorkflowProps> = ({ order, onUpdate }) => {
  const { data: session } = useSession();
  const { updateOrderStatus, setExpectedDeliveryDate, markAsDelivered } = useOrderStore();
  
  const [reviewNote, setReviewNote] = useState('');
  const [expectedDate, setExpectedDate] = useState<string>(
    order.expectedDeliveryDate 
      ? format(new Date(order.expectedDeliveryDate), 'yyyy-MM-dd')
      : format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd') // Par défaut: dans une semaine
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = (status: OrderStatus) => {
    setIsUpdating(true);
    
    try {
      updateOrderStatus(
        order.id, 
        status, 
        session?.user?.name || undefined,
        reviewNote || undefined
      );
      
      toast.success(`Commande ${getStatusLabel(status).toLowerCase()}`);
      setReviewNote('');
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
      console.error("Erreur de mise à jour de statut:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetDeliveryDate = () => {
    setIsUpdating(true);
    
    try {
      setExpectedDeliveryDate(order.id, new Date(expectedDate));
      toast.success("Date de livraison mise à jour");
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error("Erreur lors de la définition de la date de livraison");
      console.error("Erreur de date de livraison:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkDelivered = () => {
    setIsUpdating(true);
    
    try {
      markAsDelivered(order.id);
      toast.success("Commande marquée comme livrée");
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error("Erreur lors du marquage de la livraison");
      console.error("Erreur de marquage livraison:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      case 'awaiting_delivery': return 'En attente de livraison';
      case 'delivered': return 'Livrée';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'awaiting_delivery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'delivered': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card className="p-4 bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Statut actuel:</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Afficher les boutons en fonction de l'état actuel */}
          {order.status === 'pending' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400"
                onClick={() => handleStatusUpdate('approved')}
                disabled={isUpdating}
              >
                Approuver
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
              >
                Rejeter
              </Button>
            </>
          )}
          
          {order.status === 'awaiting_delivery' && (
            <Button
              variant="outline"
              size="sm"
              className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/10 dark:text-purple-400"
              onClick={handleMarkDelivered}
              disabled={isUpdating}
            >
              Marquer comme livrée
            </Button>
          )}
        </div>
      </div>
      
      {/* Informations sur l'avancement du workflow */}
      <div className="space-y-3 mb-4">
        {/* Date de création */}
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white text-xs">1</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Création</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm', { locale: fr })}
            </p>
          </div>
        </div>
        
        {/* Approbation/Rejet */}
        <div className="flex items-start">
          <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
            order.reviewedAt 
              ? (order.status === 'rejected' 
                ? 'bg-red-500' 
                : 'bg-green-500') 
              : 'bg-gray-200 dark:bg-gray-700'
          }`}>
            <span className="text-white text-xs">2</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.status === 'rejected' ? 'Rejet' : 'Approbation'}
            </p>
            {order.reviewedAt ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(order.reviewedAt), 'dd MMMM yyyy, HH:mm', { locale: fr })}
                {order.reviewedBy ? ` par ${order.reviewedBy}` : ''}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">En attente</p>
            )}
            {order.reviewNote && (
              <p className="text-xs italic mt-1">{order.reviewNote}</p>
            )}
          </div>
        </div>
        
        {/* Date de livraison prévue */}
        <div className="flex items-start">
          <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
            order.expectedDeliveryDate 
              ? 'bg-blue-500' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`}>
            <span className="text-white text-xs">3</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Date de livraison prévue
            </p>
            {order.expectedDeliveryDate ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(order.expectedDeliveryDate), 'dd MMMM yyyy', { locale: fr })}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">Non définie</p>
            )}
          </div>
        </div>
        
        {/* Livraison effective */}
        <div className="flex items-start">
          <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
            order.deliveredAt 
              ? 'bg-purple-500' 
              : 'bg-gray-200 dark:bg-gray-700'
          }`}>
            <span className="text-white text-xs">4</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Livraison</p>
            {order.deliveredAt ? (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(new Date(order.deliveredAt), 'dd MMMM yyyy, HH:mm', { locale: fr })}
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">En attente</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions disponibles en fonction du statut */}
      {order.status === 'pending' && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Note (optionnelle):
          </label>
          <textarea
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            rows={2}
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="Ajouter un commentaire sur cette commande..."
          />
        </div>
      )}
      
      {order.status !== 'rejected' && order.status !== 'delivered' && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date de livraison prévue:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetDeliveryDate}
              disabled={isUpdating}
            >
              Définir
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};