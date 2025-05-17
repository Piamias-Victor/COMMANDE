// src/components/features/OrderWorkflow.tsx (version améliorée)
import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useOrderStore } from '@/store/orderStore';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
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
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);

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
      // Continuation du composant OrderWorkflow.tsx
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'awaiting_delivery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'delivered': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Gestion du statut et de la livraison</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approuver
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
              >
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Rejeter
                </span>
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
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Marquer comme livrée
              </span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Workflow visuel */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          {/* Ligne de progression */}
          <div className="absolute top-4 left-5 right-5 h-0.5 bg-gray-200 dark:bg-gray-700" />
          
          <div className="flex justify-between items-center relative">
            {/* Étape 1: Création */}
            <div className="flex flex-col items-center z-10">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">Création</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            
            {/* Étape 2: Approbation */}
            <div className="flex flex-col items-center z-10">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                ${order.reviewedAt 
                  ? (order.status === 'rejected' ? 'bg-red-500' : 'bg-green-500') 
                  : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                {order.status === 'rejected' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">
                  {order.status === 'rejected' ? 'Rejet' : 'Approbation'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {order.reviewedAt ? format(new Date(order.reviewedAt), 'dd/MM/yyyy', { locale: fr }) : 'En attente'}
                </p>
              </div>
            </div>
            
            {/* Étape 3: Livraison programmée */}
            <div className="flex flex-col items-center z-10">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                ${order.expectedDeliveryDate ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">Programmation</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {order.expectedDeliveryDate ? format(new Date(order.expectedDeliveryDate), 'dd/MM/yyyy', { locale: fr }) : 'Non définie'}
                </p>
              </div>
            </div>
            
            {/* Étape 4: Livraison */}
            <div className="flex flex-col items-center z-10">
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                ${order.deliveredAt ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">Livraison</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {order.deliveredAt ? format(new Date(order.deliveredAt), 'dd/MM/yyyy', { locale: fr }) : 'En attente'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions disponibles en fonction du statut */}
      {order.status === 'pending' && (
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsNoteExpanded(!isNoteExpanded)}
            >
              {isNoteExpanded ? 'Masquer la note' : 'Ajouter une note'}
            </Button>
          </div>
          
          {isNoteExpanded && (
            <div className="mt-2">
              <Textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Ajouter un commentaire sur cette commande..."
                rows={3}
                className="mb-2"
              />
            </div>
          )}
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
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-white p-2"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
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
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <p>
              <strong>Statut actuel:</strong> {getStatusLabel(order.status)}
              {order.reviewedBy && (
                <> • Revu par: {order.reviewedBy}</>
              )}
            </p>
            {order.reviewNote && (
              <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                <p><strong>Note:</strong> {order.reviewNote}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
        