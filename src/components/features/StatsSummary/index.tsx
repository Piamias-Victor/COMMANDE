import React from 'react';
import { Card } from '@/components/ui/Card';
import { useStatsSummary } from '@/hooks/useStatsSummary';
import { StatCard } from './StatCard';
import Link from 'next/link';

export const StatsSummary: React.FC = () => {
  const stats = useStatsSummary();
  
  return (
    <Card className="bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Résumé</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Laboratoires"
          value={stats.totalLabsCount}
          color="blue"
        />
        
        <StatCard
          title="Pharmacies"
          value={stats.activePharmaciesCount}
          secondaryValue={`/ ${stats.totalPharmaciesCount}`}
          color="pink"
          animationDelay="0.1s"
        />
        
        <StatCard
          title="Commandes"
          value={stats.totalOrdersCount}
          color="green"
          animationDelay="0.2s"
        />
        
        <StatCard
          title="Références"
          value={stats.totalReferencesCount}
          color="purple"
          animationDelay="0.3s"
        />
        
        <StatCard
          title="Boîtes"
          value={stats.totalBoxesCount}
          color="indigo"
          animationDelay="0.4s"
        />
        
        <StatCard
          title="Dernière activité"
          value={stats.lastOrder 
            ? new Date(stats.lastOrder.createdAt).toLocaleDateString() 
            : 'Aucune activité'}
          color="gray"
          animationDelay="0.5s"
        />
      </div>
      
      <div className="mt-4 text-right">
        <Link 
          href="/stats" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Voir toutes les statistiques →
        </Link>
      </div>
    </Card>
  );
};