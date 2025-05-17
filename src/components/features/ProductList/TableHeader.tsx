import React from 'react';

export const TableHeader: React.FC = () => (
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
);