import React from 'react';
import { Product } from '@/hooks/useProductsParser';

interface TableRowProps {
  product: Product;
  index: number;
  startIndex: number;
}

export const TableRow: React.FC<TableRowProps> = ({ product, index, startIndex }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
      {startIndex + index + 1}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
      {product.code}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
      {product.quantity}
    </td>
  </tr>
);