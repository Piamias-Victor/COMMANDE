// src/hooks/useOrderActions.ts
import { useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { useSession } from 'next-auth/react';
import { OrderStatus } from '@/types';
import toast from 'react-hot-toast';

export function useOrderActions(orderId: string) {
  const { data: session } = useSession();
  const { updateOrderStatus, setExpectedDeliveryDate, markAsDelivered } = useOrderStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleStatusUpdate = async (
    status: OrderStatus,
    note?: string
  ) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      updateOrderStatus(
        orderId,
        status,
        session?.user?.name || undefined,
        note
      );
      
      const statusLabels: Record<OrderStatus, string> = {
        pending: 'en attente',
        approved: 'approuvée',
        rejected: 'rejetée',
        awaiting_delivery: 'en attente de livraison',
        delivered: 'livrée'
      };
      
      toast.success(`Commande ${statusLabels[status]}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSetDeliveryDate = async (date: Date) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      setExpectedDeliveryDate(orderId, date);
      toast.success('Date de livraison définie');
      return true;
    } catch (error) {
      console.error('Erreur lors de la définition de la date de livraison:', error);
      toast.error('Erreur lors de la définition de la date de livraison');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleMarkDelivered = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      markAsDelivered(orderId);
      toast.success('Commande marquée comme livrée');
      return true;
    } catch (error) {
      console.error('Erreur lors du marquage de la livraison:', error);
      toast.error('Erreur lors du marquage de la livraison');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Force refresh (pour après les actions)
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return {
    isProcessing,
    handleStatusUpdate,
    handleSetDeliveryDate,
    handleMarkDelivered,
    handleRefresh
  };
}