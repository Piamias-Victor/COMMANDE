import React from 'react';
import { Lab, Pharmacy, Order } from '@/types';

interface OrderDetailsGridProps {
  order: Order;
  lab: Lab | null;
  pharmacy: Pharmacy | null;
  formatDate: (date: Date | string) => string;
}

export const OrderDetailsGrid: React.FC<OrderDetailsGridProps> = ({ 
  order, 
  lab, 
  pharmacy, 
  formatDate 
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Laboratoire</p>
      <p className="font-medium">{lab?.name || 'Inconnu'}</p>
    </div>
    
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Pharmacie</p>
      <p className="font-medium">{pharmacy?.name || 'Inconnue'}</p>
    </div>
    
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Date de création</p>
      <p className="font-medium">{formatDate(order.createdAt)}</p>
    </div>
    
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour</p>
      <p className="font-medium">
        {order.reviewedAt ? formatDate(order.reviewedAt) : 'N/A'}
      </p>
    </div>
  </div>
);