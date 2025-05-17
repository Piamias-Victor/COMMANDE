import React from 'react';

interface TableHeaderProps {
  sortField: string;
  handleSort: (field: any) => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ sortField, handleSort }) => {
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          onClick={() => handleSort('date')}
        >
          Date {renderSortIcon('date')}
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          onClick={() => handleSort('fileName')}
        >
          Fichier {renderSortIcon('fileName')}
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Laboratoire
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Pharmacie
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          onClick={() => handleSort('referencesCount')}
        >
          Références {renderSortIcon('referencesCount')}
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          onClick={() => handleSort('boxesCount')}
        >
          Boîtes {renderSortIcon('boxesCount')}
        </th>
        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
  );
};