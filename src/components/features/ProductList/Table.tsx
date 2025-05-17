import React from 'react';
import { Product } from '@/hooks/useProductsParser';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { EmptyState } from './EmptyState';

interface TableProps {
  products: Product[];
  currentPage: number;
  itemsPerPage: number;
  search: string;
  totalFilteredProducts: number;
}

export const Table: React.FC<TableProps> = ({
  products,
  currentPage,
  itemsPerPage,
  search,
  totalFilteredProducts
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;

  if (products.length === 0) {
    return <EmptyState search={search} />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader />
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {products.map((product, index) => (
            <TableRow 
              key={`${product.code}-${index}`}
              product={product}
              index={index}
              startIndex={startIndex}
            />
          ))}
        </tbody>
      </table>
      
      {totalFilteredProducts > itemsPerPage && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          Affichage de {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalFilteredProducts)} sur {totalFilteredProducts} résultats
        </div>
      )}
    </div>
  );
};