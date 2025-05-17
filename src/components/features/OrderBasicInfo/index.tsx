import React from 'react';
import { Card } from '@/components/ui/Card';
import { Order, Lab, Pharmacy } from '@/types';
import { useOrderBasicInfo } from '@/hooks/useOrderBasicInfo';
import { StatusBadge } from './StatusBadge';
import { OrderStats } from './OrderStats';
import { ActionButtons } from './ActionButtons';
import { OrderDetailsGrid } from './OrderDetailsGrid';
import { StatusMessage } from './StatusMessage';

interface OrderBasicInfoProps {
  order: Order;
  lab: Lab | null;
  pharmacy: Pharmacy | null;
}

export const OrderBasicInfo: React.FC<OrderBasicInfoProps> = ({ order, lab, pharmacy }) => {
  const { isDownloading, handleDownload, formatDate } = useOrderBasicInfo(order, lab, pharmacy);
  
  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={order.status} />
            <h2 className="text-xl font-semibold">{order.fileName}</h2>
          </div>
          
          <OrderDetailsGrid 
            order={order}
            lab={lab}
            pharmacy={pharmacy}
            formatDate={formatDate}
          />
          
          <StatusMessage order={order} formatDate={formatDate} />
        </div>
        
        <div className="flex flex-col md:items-end gap-4">
          <OrderStats
            referencesCount={order.referencesCount}
            boxesCount={order.boxesCount}
          />
          
          <ActionButtons
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        </div>
      </div>
    </Card>
  );
};