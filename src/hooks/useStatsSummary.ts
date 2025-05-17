import { useMemo } from 'react';
import { useLabStore } from '@/store/labStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { useOrderStore } from '@/store/orderStore';

export function useStatsSummary() {
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  const { orders } = useOrderStore();
  
  // Calcul des statistiques
  const stats = useMemo(() => {
    // Normaliser les IDs de pharmacie
    const normalizePharmacyId = (id: string): string => {
      // Si l'ID est de la forme "pharmacy-X", vérifier s'il existe une pharmacie dans le store
      if (id.startsWith('pharmacy-')) {
        const matchingPharmacy = pharmacies.find(p => p.id === id);
        if (matchingPharmacy) return matchingPharmacy.id;
        
        // Essayer de trouver une pharmacie par numéro
        const index = parseInt(id.split('-')[1]);
        if (index >= 1 && index <= 5 && pharmacies.length >= index) {
          return pharmacies[index - 1].id;
        }
      }
      
      return id;
    };
    
    // Comptage des pharmacies actives
    const activePharmacyIds = new Set<string>();
    orders.forEach(order => {
      const normalizedId = normalizePharmacyId(order.pharmacyId);
      activePharmacyIds.add(normalizedId);
    });
    
    // Trouver la dernière commande
    const lastOrder = orders.length > 0 
      ? [...orders].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      : null;
    
    // Retourner toutes les statistiques
    return {
      totalLabsCount: labs.length,
      totalPharmaciesCount: pharmacies.length,
      activePharmaciesCount: activePharmacyIds.size,
      totalOrdersCount: orders.length,
      totalReferencesCount: orders.reduce((total, order) => total + order.referencesCount, 0),
      totalBoxesCount: orders.reduce((total, order) => total + order.boxesCount, 0),
      lastOrder
    };
  }, [labs, pharmacies, orders]);

  return stats;
}