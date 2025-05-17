import { useState, useCallback } from 'react';
import { Order, Lab, Pharmacy, OrderStatus } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

// Styles pour les différents statuts
export const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  awaiting_delivery: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
};

// Labels pour les différents statuts
export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  approved: 'Approuvée',
  rejected: 'Rejetée',
  awaiting_delivery: 'En attente de livraison',
  delivered: 'Livrée'
};

export function useOrderBasicInfo(order: Order, lab: Lab | null, pharmacy: Pharmacy | null) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Formater les dates en français
  const formatDate = useCallback((date: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  }, []);
  
  // Télécharger le fichier CSV
  const handleDownload = useCallback(() => {
    setIsDownloading(true);
    
    setTimeout(() => {
      try {
        const blob = new Blob([order.rawContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = order.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Fichier téléchargé avec succès');
      } catch (error) {
        toast.error('Erreur lors du téléchargement');
      } finally {
        setIsDownloading(false);
      }
    }, 500);
  }, [order.fileName, order.rawContent]);

  return {
    isDownloading,
    handleDownload,
    formatDate
  };
}