// src/components/features/ProductList.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Order } from '@/types';
import { useProductsParser, Product } from '@/hooks/useProductsParser';
import { Spinner } from '@/components/ui/Spinner';

interface ProductListProps {
  order: Order;
}

export const ProductList: React.FC<ProductListProps> = ({ order }) => {
  const {
    products,
    filteredProducts,
    totalQuantity,
    uniqueCodesCount,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    setItemsPerPage
  } = useProductsParser(order);
  
  if (!products || products.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Aucun produit trouvé dans cette commande
          </p>
        </div>
      </Card>
    );
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Réinitialiser à la première page lors du changement d'items par page
  };
  
  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div>
          <h3 className="text-lg font-medium">Liste des produits</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {uniqueCodesCount} références uniques, {totalQuantity} boîtes au total
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Rechercher un code..."
            value={search}
            onChange={handleSearchChange}
            className="min-w-[200px]"
          />
          
          <select
            className="shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block sm:text-sm p-2"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10 par page</option>
            <option value={25}>25 par page</option>
            <option value={50}>50 par page</option>
            <option value={100}>100 par page</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Code EAN13
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Quantité
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {filteredProducts.map((product, index) => (
              <tr 
                key={`${product.code}-${index}`} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                  {product.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                  {product.quantity}
                </td>
              </tr>
            ))}
            
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  {search 
                    ? `Aucun produit ne correspond à la recherche "${search}"`
                    : 'Aucun produit trouvé'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} sur {totalPages}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lsaquo;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &rsaquo;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};