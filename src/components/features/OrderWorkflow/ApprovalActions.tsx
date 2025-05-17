import React from 'react';
import { Button } from '@/components/ui/Button';
import { OrderStatus } from '@/types';

interface ApprovalActionsProps {
  isUpdating: boolean;
  onStatusUpdate: (status: OrderStatus) => void;
}

export const ApprovalActions: React.FC<ApprovalActionsProps> = ({
  isUpdating,
  onStatusUpdate
}) => (
  <div className="flex flex-wrap gap-2">
    <Button
      variant="outline"
      size="sm"
      className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400"
      onClick={() => onStatusUpdate('approved')}
      disabled={isUpdating}
    >
      <span className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Approuver
      </span>
    </Button>
    <Button
      variant="outline"
      size="sm"
      className="bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400"
      onClick={() => onStatusUpdate('rejected')}
      disabled={isUpdating}
    >
      <span className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Rejeter
      </span>
    </Button>
  </div>
);