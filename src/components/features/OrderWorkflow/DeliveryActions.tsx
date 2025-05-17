import React from 'react';
import { Button } from '@/components/ui/Button';

interface DeliveryActionsProps {
  isUpdating: boolean;
  onMarkDelivered: () => void;
}

export const DeliveryActions: React.FC<DeliveryActionsProps> = ({
  isUpdating,
  onMarkDelivered
}) => (
  <Button
    variant="outline"
    size="sm"
    className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/10 dark:text-purple-400"
    onClick={onMarkDelivered}
    disabled={isUpdating}
  >
    <span className="flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
      Marquer comme livrée
    </span>
  </Button>
);