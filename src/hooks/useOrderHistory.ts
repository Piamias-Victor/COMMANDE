import { useMemo, useCallback } from 'react';
import { Order } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export type EventType = 'creation' | 'status_change' | 'delivery' | 'note';

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: EventType;
  actor?: string;
}

export function useOrderHistory(order: Order) {
  // Formater les dates pour l'affichage
  const formatDate = useCallback((date: Date): string => {
    return format(date, 'dd MMM yyyy, HH:mm', { locale: fr });
  }, []);

  // Formater une date pour la description
  const formatDescriptionDate = useCallback((date: Date): string => {
    return format(date, 'dd MMMM yyyy', { locale: fr });
  }, []);

  // Construire une chronologie des événements
  const events = useMemo<TimelineEvent[]>(() => {
    const eventsList: TimelineEvent[] = [];
    
    // Création de la commande
    eventsList.push({
      id: 'creation',
      date: new Date(order.createdAt),
      title: 'Création de la commande',
      description: `Commande "${order.fileName}" créée`,
      type: 'creation'
    });
    
    // Approbation/Rejet
    if (order.reviewedAt) {
      eventsList.push({
        id: 'review',
        date: new Date(order.reviewedAt),
        title: order.status === 'rejected' ? 'Commande rejetée' : 'Commande approuvée',
        description: order.reviewNote || (order.status === 'rejected' 
          ? 'La commande a été rejetée' 
          : 'La commande a été approuvée'),
        type: 'status_change',
        actor: order.reviewedBy
      });
    }
    
    // Date de livraison prévue
    if (order.expectedDeliveryDate) {
      eventsList.push({
        id: 'delivery_date',
        date: new Date(order.expectedDeliveryDate),
        title: 'Date de livraison définie',
        description: `Livraison prévue le ${formatDescriptionDate(new Date(order.expectedDeliveryDate))}`,
        type: 'delivery'
      });
    }
    
    // Livraison
    if (order.deliveredAt) {
      eventsList.push({
        id: 'delivered',
        date: new Date(order.deliveredAt),
        title: 'Commande livrée',
        description: `La commande a été livrée le ${formatDescriptionDate(new Date(order.deliveredAt))}`,
        type: 'delivery'
      });
    }
    
    // Trier les événements par date
    return eventsList.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [order, formatDescriptionDate]);

  // Obtenir la couleur selon le type d'événement
  const getEventColor = useCallback((type: EventType, title: string): string => {
    switch (type) {
      case 'creation':
        return 'bg-blue-500';
      case 'status_change':
        return title.includes('rejetée') ? 'bg-red-500' : 'bg-green-500';
      case 'delivery':
        return 'bg-purple-500';
      case 'note':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }, []);

  // Obtenir l'icône selon le type d'événement
  const getEventIcon = useCallback((type: EventType, title: string): string => {
    switch (type) {
      case 'creation':
        return "M12 6v6m0 0v6m0-6h6m-6 0H6";
      case 'status_change':
        if (title.includes('rejetée')) {
          return "M6 18L18 6M6 6l12 12";
        }
        return "M5 13l4 4L19 7";
      case 'delivery':
        return "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4";
      case 'note':
        return "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z";
      default:
        return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    }
  }, []);

  return { 
    events, 
    formatDate, 
    getEventColor,
    getEventIcon,
    hasEvents: events.length > 0
  };
}