import React from 'react';
import { Order } from '@/types';
import { TimelineStep } from './TimelineStep';

interface WorkflowStatusProps {
  order: Order;
  formatDate: (date: Date | string | undefined) => string;
}

export const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ 
  order, 
  formatDate 
}) => (
  <div className="space-y-3 mb-6">
    <div className="relative">
      <div className="absolute top-4 left-5 right-5 h-0.5 bg-gray-200 dark:bg-gray-700" />
      
      <div className="flex justify-between items-center relative">
        {/* Étape 1: Création */}
        <TimelineStep
          isActive={true}
          title="Création"
          date={formatDate(order.createdAt)}
          icon="M12 6v6m0 0v6m0-6h6m-6 0H6"
          color="bg-blue-500"
        />
        
        {/* Étape 2: Approbation */}
        <TimelineStep
          isActive={!!order.reviewedAt}
          title={order.status === 'rejected' ? 'Rejet' : 'Approbation'}
          date={formatDate(order.reviewedAt)}
          icon={order.status === 'rejected' ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"}
          color={order.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'}
        />
        
        {/* Étape 3: Livraison programmée */}
        <TimelineStep
          isActive={!!order.expectedDeliveryDate}
          title="Programmation"
          date={order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : 'Non définie'}
          icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          color="bg-blue-500"
        />
        
        {/* Étape 4: Livraison */}
        <TimelineStep
          isActive={!!order.deliveredAt}
          title="Livraison"
          date={formatDate(order.deliveredAt)}
          icon="M5 13l4 4L19 7"
          color="bg-purple-500"
        />
      </div>
    </div>
  </div>
);