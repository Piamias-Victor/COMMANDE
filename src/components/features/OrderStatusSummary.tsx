import React, { useMemo } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { OrderStatus } from '@/types';

export const OrderStatusSummary: React.FC = () => {
  const { orders } = useOrderStore();
  
  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      awaiting_delivery: 0,
      delivered: 0
    };
    
    orders.forEach(order => {
      counts[order.status]++;
    });
    
    return counts;
  }, [orders]);
  
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'awaiting_delivery': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'delivered': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvées';
      case 'rejected': return 'Rejetées';
      case 'awaiting_delivery': return 'En attente de livraison';
      case 'delivered': return 'Livrées';
      default: return 'Inconnues';
    }
  };

  const statuses: OrderStatus[] = ['pending', 'approved', 'awaiting_delivery', 'delivered', 'rejected'];

  if (orders.length === 0) {
    return null; // Ne pas afficher si aucune commande
  }

  return (
    <Card className="bg-white dark:bg-gray-800 mb-6">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Statut des commandes</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {statuses.map(status => (
            <Link
              key={status}
              href={`/orders?status=${status}`}
              className={`p-4 rounded-lg transition-all hover:shadow-md ${getStatusColor(status)}`}
            >
              <p className="text-2xl font-bold mb-1">{statusCounts[status]}</p>
              <p className="text-sm">{getStatusLabel(status)}</p>
            </Link>
          ))}
        </div>
      </div>
    </Card>
  );
};