import React from 'react';
import { useLabStore } from '@/store/labStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { useOrderStore } from '@/store/orderStore';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export const StatsSummary: React.FC = () => {
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  const { orders } = useOrderStore();
  
  const totalLabsCount = labs.length;
  const totalPharmaciesCount = pharmacies.length;
  
  // Fonction pour normaliser les IDs de pharmacie (gérer les IDs NextAuth)
  const normalizePharmacyId = (id: string): string => {
    // Si l'ID est de la forme "pharmacy-X", vérifier s'il existe une pharmacie 
    // dans le store qui correspond à cet ID
    if (id.startsWith('pharmacy-')) {
      const matchingPharmacy = pharmacies.find(p => p.id === id);
      if (matchingPharmacy) {
        return matchingPharmacy.id;
      }
      
      // Essayer de trouver une pharmacie qui correspond au numéro
      const index = parseInt(id.split('-')[1]);
      if (index >= 1 && index <= 5 && pharmacies.length >= index) {
        return pharmacies[index - 1].id;
      }
    }
    
    return id;
  };
  
  // Utiliser un Set pour compter les pharmacies uniques actives
  const activePharmacyIds = new Set();
  orders.forEach(order => {
    const normalizedId = normalizePharmacyId(order.pharmacyId);
    activePharmacyIds.add(normalizedId);
  });
  
  const activePharmaciesCount = activePharmacyIds.size;
  const totalOrdersCount = orders.length;
  const totalReferencesCount = orders.reduce((total, order) => total + order.referencesCount, 0);
  const totalBoxesCount = orders.reduce((total, order) => total + order.boxesCount, 0);
  
  // Trouver la dernière commande
  const lastOrder = orders.length > 0 
    ? [...orders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : null;

  return (
    <Card className="bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Résumé</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg fade-in">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Laboratoires</p>
          <p className="text-2xl font-semibold text-blue-800 dark:text-blue-200">{totalLabsCount}</p>
        </div>
        
        <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg fade-in" style={{ animationDelay: '0.1s' }}>
          <p className="text-sm text-pink-700 dark:text-pink-300 mb-1">Pharmacies</p>
          <p className="text-2xl font-semibold text-pink-800 dark:text-pink-200">
            {activePharmaciesCount} <span className="text-sm font-normal">/ {totalPharmaciesCount}</span>
          </p>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm text-green-700 dark:text-green-300 mb-1">Commandes</p>
          <p className="text-2xl font-semibold text-green-800 dark:text-green-200">{totalOrdersCount}</p>
        </div>
        
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Références</p>
          <p className="text-2xl font-semibold text-purple-800 dark:text-purple-200">{totalReferencesCount}</p>
        </div>
        
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Boîtes</p>
          <p className="text-2xl font-semibold text-indigo-800 dark:text-indigo-200">{totalBoxesCount}</p>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Dernière activité</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
            {lastOrder 
              ? new Date(lastOrder.createdAt).toLocaleDateString() 
              : 'Aucune activité'}
          </p>
        </div>
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