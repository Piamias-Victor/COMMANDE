import React from 'react';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface DeliveryDateFormProps {
  expectedDate: string;
  setExpectedDate: (date: string) => void;
  onSetDeliveryDate: () => void;
  isUpdating: boolean;
  order: any;
}

export const DeliveryDateForm: React.FC<DeliveryDateFormProps> = ({
  expectedDate,
  setExpectedDate,
  onSetDeliveryDate,
  isUpdating,
  order
}) => (
  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      Date de livraison prévue:
    </label>
    <div className="flex items-center gap-2">
      <input
        type="date"
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-white p-2"
        value={expectedDate}
        onChange={(e) => setExpectedDate(e.target.value)}
        min={format(new Date(), 'yyyy-MM-dd')}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onSetDeliveryDate}
        disabled={isUpdating}
      >
        Définir
      </Button>
    </div>
    
    {(order.reviewNote || order.reviewedBy) && (
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>
          <strong>Statut actuel:</strong> {order.status === 'rejected' ? 'Rejetée' : 'Approuvée'}
          {order.reviewedBy && (
            <> • Revu par: {order.reviewedBy}</>
          )}
        </p>
        {order.reviewNote && (
          <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <p><strong>Note:</strong> {order.reviewNote}</p>
          </div>
        )}
      </div>
    )}
  </div>
);