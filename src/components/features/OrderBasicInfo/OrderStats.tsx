import React from 'react';

interface OrderStatsProps {
  referencesCount: number;
  boxesCount: number;
}

export const OrderStats: React.FC<OrderStatsProps> = ({ referencesCount, boxesCount }) => (
  <div className="grid grid-cols-2 gap-4">
    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="text-lg font-bold">{referencesCount}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">Références</span>
    </div>
    <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="text-lg font-bold">{boxesCount}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">Boîtes</span>
    </div>
  </div>
);