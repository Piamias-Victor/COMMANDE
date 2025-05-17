import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface TableRowProps {
  order: Order;
  labName: string;
  pharmacyName: string;
  isDownloading: boolean;
  isDeleting: boolean;
  onDownload: () => void;
  onDelete: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  order,
  labName,
  pharmacyName,
  isDownloading,
  isDeleting,
  onDownload,
  onDelete
}) => {
  // Format date safely
  const formatDate = (dateInput: Date | string) => {
    try {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      return format(date, 'dd MMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <tr 
      className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isDeleting ? 'opacity-50' : ''
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDate(order.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {order.fileName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {labName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {pharmacyName}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {order.referencesCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {order.boxesCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <Link href={`/orders/${order.id}`}>
            <Button variant="outline" size="sm">
              Détails
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            loading={isDownloading}
            disabled={isDownloading || isDeleting}
          >
            Télécharger
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            onClick={onDelete}
            loading={isDeleting}
            disabled={isDownloading || isDeleting}
          >
            Supprimer
          </Button>
        </div>
      </td>
    </tr>
  );
};