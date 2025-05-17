import React from 'react';
import { Card } from '@/components/ui/Card';

interface EmptyStateProps {
  type: 'no-orders' | 'no-filtered-orders';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => (
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {type === 'no-orders' ? (
        <>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Aucune commande disponible</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            Importez des fichiers CSV à partir de la page d'accueil pour visualiser vos commandes ici.
          </p>
        </>
      ) : (
        <p className="text-gray-500 text-sm">
          Aucune commande trouvée pour les filtres sélectionnés
        </p>
      )}
    </div>
  </Card>
);