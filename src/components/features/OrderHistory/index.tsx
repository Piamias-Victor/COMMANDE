import React from 'react';
import { Card } from '@/components/ui/Card';
import { Order } from '@/types';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import { Timeline } from './Timeline';
import { EmptyState } from './EmptyState';

interface OrderHistoryProps {
  order: Order;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ order }) => {
  const { 
    events, 
    formatDate, 
    getEventColor, 
    getEventIcon, 
    hasEvents 
  } = useOrderHistory(order);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Historique de la commande</h3>
      
      {hasEvents ? (
        <Timeline 
          events={events} 
          formatDate={formatDate} 
          getEventColor={getEventColor} 
          getEventIcon={getEventIcon} 
        />
      ) : (
        <EmptyState />
      )}
    </Card>
  );
};