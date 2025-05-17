import React from 'react';

export const EmptyState: React.FC = () => (
  <div className="text-center py-8">
    <svg 
      className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
      />
    </svg>
    <p className="text-gray-500 dark:text-gray-400">
      Aucun événement trouvé pour cette commande
    </p>
  </div>
);