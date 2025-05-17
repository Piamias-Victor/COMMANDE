import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useOrderStore } from '@/store/orderStore';
import { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

export const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  awaiting_delivery: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Rejetée',
  awaiting_delivery: 'En attente de livraison',
  delivered: 'Livrée'
};

export function useOrderWorkflow(order: Order, onUpdate?: () => void) {
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

  const handleStatusUpdate = useCallback((status: OrderStatus) => {
    setIsUpdating(true);
    
    try {
      updateOrderStatus(
        order.id, 
        status, 
        session?.user?.name || undefined,
        reviewNote || undefined
      );
      
      toast.success(`Commande ${STATUS_LABELS[status].toLowerCase()}`);
      setReviewNote('');
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setIsUpdating(false);
    }
  }, [order.id, reviewNote, session?.user?.name, updateOrderStatus, onUpdate]);

  const handleSetDeliveryDate = useCallback(() => {
    setIsUpdating(true);
    
    try {
      setExpectedDeliveryDate(order.id, new Date(expectedDate));
      toast.success("Date de livraison mise à jour");
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error("Erreur lors de la définition de la date de livraison");
    } finally {
      setIsUpdating(false);
    }
  }, [expectedDate, order.id, setExpectedDeliveryDate, onUpdate]);

  const handleMarkDelivered = useCallback(() => {
    setIsUpdating(true);
    
    try {
      markAsDelivered(order.id);
      toast.success("Commande marquée comme livrée");
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast.error("Erreur lors du marquage de la livraison");
    } finally {
      setIsUpdating(false);
    }
  }, [markAsDelivered, order.id, onUpdate]);

  // Formater les dates pour l'affichage
  const formatDate = useCallback((date: Date | string | undefined): string => {
    if (!date) return 'En attente';
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
  }, []);

  return {
    reviewNote,
    setReviewNote,
    expectedDate,
    setExpectedDate,
    isUpdating,
    isNoteExpanded,
    setIsNoteExpanded,
    handleStatusUpdate,
    handleSetDeliveryDate,
    handleMarkDelivered,
    formatDate
  };
}