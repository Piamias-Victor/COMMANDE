// src/components/features/OrderHistory.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Order } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface OrderHistoryProps {
  order: Order;
}

interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'creation' | 'status_change' | 'delivery' | 'note';
  actor?: string;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ order }) => {
  // Construire une chronologie des événements
  const events: TimelineEvent[] = [];
  
  // Création de la commande
  events.push({
    id: 'creation',
    date: new Date(order.createdAt),
    title: 'Création de la commande',
    description: `Commande "${order.fileName}" créée`,
    type: 'creation'
  });
  
  // Approbation/Rejet
  if (order.reviewedAt) {
    events.push({
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
    events.push({
      id: 'delivery_date',
      date: new Date(order.expectedDeliveryDate),
      title: 'Date de livraison définie',
      description: `Livraison prévue le ${format(new Date(order.expectedDeliveryDate), 'dd MMMM yyyy', { locale: fr })}`,
      type: 'delivery'
    });
  }
  
  // Livraison
  if (order.deliveredAt) {
    events.push({
      id: 'delivered',
      date: new Date(order.deliveredAt),
      title: 'Commande livrée',
      description: `La commande a été livrée le ${format(new Date(order.deliveredAt), 'dd MMMM yyyy', { locale: fr })}`,
      type: 'delivery'
    });
  }
  
  // Trier les événements par date
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Historique de la commande</h3>
      
      {events.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Aucun événement trouvé pour cette commande
        </p>
      ) : (
        <div className="relative">
          {/* Ligne verticale de la timeline */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={event.id} className="flex items-start relative">
                {/* Cercle de la timeline */}
                <div className={`
                  flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10
                  ${event.type === 'creation' ? 'bg-blue-500' : ''}
                  ${event.type === 'status_change' && order.status === 'rejected' ? 'bg-red-500' : ''}
                  ${event.type === 'status_change' && order.status !== 'rejected' ? 'bg-green-500' : ''}
                  ${event.type === 'delivery' ? 'bg-purple-500' : ''}
                  ${event.type === 'note' ? 'bg-yellow-500' : ''}
                `}>
                  {event.type === 'creation' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  {event.type === 'status_change' && order.status === 'rejected' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {event.type === 'status_change' && order.status !== 'rejected' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {event.type === 'delivery' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  )}
                  {event.type === 'note' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </div>
                
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium">{event.title}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(event.date, 'dd MMM yyyy, HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
                  {event.actor && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Par: {event.actor}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};