import React from 'react';
import { Input } from '@/components/ui/Input';

interface SearchBarProps {
  search: string;
  itemsPerPage: number;
  uniqueCodesCount: number;
  totalQuantity: number;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onItemsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  search,
  itemsPerPage,
  uniqueCodesCount,
  totalQuantity,
  onSearchChange,
  onItemsPerPageChange
}) => {
  return (
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
          onChange={onSearchChange}
          className="min-w-[200px]"
        />
        
        <select
          className="shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block sm:text-sm p-2"
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
        >
          <option value={10}>10 par page</option>
          <option value={25}>25 par page</option>
          <option value={50}>50 par page</option>
          <option value={100}>100 par page</option>
        </select>
      </div>
    </div>
  );
};