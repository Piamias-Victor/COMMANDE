import React from 'react';

interface EmptyStateProps {
  search: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ search }) => (
  <tr>
    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
      {search 
        ? `Aucun produit ne correspond à la recherche "${search}"`
        : 'Aucun produit trouvé'
      }
    </td>
  </tr>
);