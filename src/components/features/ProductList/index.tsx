import React from 'react';
import { Card } from '@/components/ui/Card';
import { Order } from '@/types';
import { useProductList } from '@/hooks/useProductList';
import { SearchBar } from './SearchBar';
import { Table } from './Table';
import { Pagination } from './Pagination';

interface ProductListProps {
  order: Order;
}

export const ProductList: React.FC<ProductListProps> = ({ order }) => {
  const {
    products,
    displayedProducts,
    totalQuantity,
    uniqueCodesCount,
    search,
    currentPage,
    totalPages,
    itemsPerPage,
    handleSearchChange,
    handlePageChange,
    handleItemsPerPageChange,
    totalFilteredProducts
  } = useProductList(order);
  
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
  
  return (
    <Card className="p-6">
      <SearchBar 
        search={search}
        itemsPerPage={itemsPerPage}
        uniqueCodesCount={uniqueCodesCount}
        totalQuantity={totalQuantity}
        onSearchChange={handleSearchChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      
      <Table 
        products={displayedProducts}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        search={search}
        totalFilteredProducts={totalFilteredProducts}
      />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </Card>
  );
};