import React from 'react';
import { Order } from '@/types';

interface StatusMessageProps {
  order: Order;
  formatDate: (date: Date | string) => string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ order, formatDate }) => {
  // Ne rien afficher si aucun message spécifique
  if (order.status !== 'awaiting_delivery' && 
      order.status !== 'delivered' && 
      order.status !== 'rejected') {
    return null;
  }

  // Message pour les commandes en attente de livraison
  if (order.status === 'awaiting_delivery' && order.expectedDeliveryDate) {
    return (
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-medium">Livraison prévue le:</span> {formatDate(order.expectedDeliveryDate)}
        </p>
      </div>
    );
  }
  
  // Message pour les commandes livrées
  if (order.status === 'delivered' && order.deliveredAt) {
    return (
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-md">
        <p className="text-sm text-green-800 dark:text-green-300">
          <span className="font-medium">Livrée le:</span> {formatDate(order.deliveredAt)}
        </p>
      </div>
    );
  }
  
  // Message pour les commandes rejetées
  if (order.status === 'rejected' && order.reviewNote) {
    return (
      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-md">
        <p className="text-sm text-red-800 dark:text-red-300">
          <span className="font-medium">Motif de rejet:</span> {order.reviewNote}
        </p>
      </div>
    );
  }
  
  return null;
};