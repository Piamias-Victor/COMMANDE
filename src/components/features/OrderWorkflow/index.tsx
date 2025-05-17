import React from 'react';
import { Card } from '@/components/ui/Card';
import { Order } from '@/types';
import { useOrderWorkflow } from '@/hooks/useOrderWorkflow';
import { StatusBadge } from './StatusBadge';
import { WorkflowStatus } from './WorkflowStatus';
import { ApprovalActions } from './ApprovalActions';
import { DeliveryActions } from './DeliveryActions';
import { NoteForm } from './NoteForm';
import { DeliveryDateForm } from './DeliveryDateForm';

interface OrderWorkflowProps {
  order: Order;
  onUpdate?: () => void;
}

export const OrderWorkflow: React.FC<OrderWorkflowProps> = ({ order, onUpdate }) => {
  const {
    reviewNote,
    setReviewNote,
    expectedDate,
    setExpectedDate,
    isUpdating,
    isNoteExpanded,
    setIsNoteExpanded,
    handleStatusUpdate,
    handleSetDeliveryDate,
    handleMarkDelivered,
    formatDate
  } = useOrderWorkflow(order, onUpdate);

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Gestion du statut et de la livraison</h3>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Statut actuel:</span>
          <StatusBadge status={order.status} />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {order.status === 'pending' && (
            <ApprovalActions
              isUpdating={isUpdating}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
          
          {order.status === 'awaiting_delivery' && (
            <DeliveryActions
              isUpdating={isUpdating}
              onMarkDelivered={handleMarkDelivered}
            />
          )}
        </div>
      </div>
      
      <WorkflowStatus order={order} formatDate={formatDate} />
      
      {order.status === 'pending' && (
        <NoteForm
          isNoteExpanded={isNoteExpanded}
          setIsNoteExpanded={setIsNoteExpanded}
          reviewNote={reviewNote}
          setReviewNote={setReviewNote}
        />
      )}
      
      {order.status !== 'rejected' && order.status !== 'delivered' && (
        <DeliveryDateForm
          expectedDate={expectedDate}
          setExpectedDate={setExpectedDate}
          onSetDeliveryDate={handleSetDeliveryDate}
          isUpdating={isUpdating}
          order={order}
        />
      )}
    </Card>
  );
};