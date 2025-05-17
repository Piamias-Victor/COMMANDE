import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Order } from '@/types';

interface WorkflowTimelineProps {
  order: Order;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ order }) => {
  const formatDate = (date?: Date | string) => {
    if (!date) return 'En attente';
    return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
  };

  return (
    <div className="space-y-3 mb-6">
      <div className="relative">
        <div className="absolute top-4 left-5 right-5 h-0.5 bg-gray-200 dark:bg-gray-700" />
        <div className="flex justify-between items-center relative">
          <TimelineItem 
            isActive={true}
            label="Création"
            date={formatDate(order.createdAt)}
            icon="M12 6v6m0 0v6m0-6h6m-6 0H6"
            color="bg-blue-500"
          />
          <TimelineItem 
            isActive={!!order.reviewedAt}
            label={order.status === 'rejected' ? 'Rejet' : 'Approbation'}
            date={formatDate(order.reviewedAt)}
            icon={order.status === 'rejected' ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"}
            color={order.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'}
          />
          <TimelineItem 
            isActive={!!order.expectedDeliveryDate}
            label="Programmation"
            date={order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : 'Non définie'}
            icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            color="bg-blue-500"
          />
          <TimelineItem 
            isActive={!!order.deliveredAt}
            label="Livraison"
            date={formatDate(order.deliveredAt)}
            icon="M5 13l4 4L19 7"
            color="bg-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

interface TimelineItemProps {
  isActive: boolean;
  label: string;
  date: string;
  icon: string;
  color: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ isActive, label, date, icon, color }) => (
  <div className="flex flex-col items-center z-10">
    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isActive ? color : 'bg-gray-200 dark:bg-gray-700'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div className="mt-2 text-center">
      <p className="text-xs font-medium">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
    </div>
  </div>
);