import React from 'react';
import { Card } from '@/components/ui/Card';

export const EmptyState: React.FC = () => (
  <Card>
    <div className="empty-state py-12">
      <svg
        className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Aucune statistique disponible</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
        Importez des fichiers CSV à partir de la page d'accueil pour visualiser vos statistiques ici.
      </p>
    </div>
  </Card>
);