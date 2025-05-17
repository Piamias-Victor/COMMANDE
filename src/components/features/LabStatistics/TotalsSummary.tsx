import React from 'react';

interface TotalsSummaryProps {
  totals: {
    orders: number;
    pharmacies: number;
    references: number;
    boxes: number;
  };
}

export const TotalsSummary: React.FC<TotalsSummaryProps> = ({ totals }) => (
  <div className="mt-6 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-md">
    <h4 className="text-sm font-medium mb-2">Totaux</h4>
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
      <div>
        <p className="text-xs text-gray-500 mb-1">Commandes</p>
        <p className="text-lg font-semibold">{totals.orders}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Pharmacies actives</p>
        <p className="text-lg font-semibold">{totals.pharmacies}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Références</p>
        <p className="text-lg font-semibold">{totals.references}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Boîtes</p>
        <p className="text-lg font-semibold">{totals.boxes}</p>
      </div>
    </div>
  </div>
);