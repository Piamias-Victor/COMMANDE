// src/hooks/useOrderDetails.ts
import { useState, useEffect, useMemo } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { useLabStore } from '@/store/labStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { Order, Lab, Pharmacy } from '@/types';

interface UseOrderDetailsResult {
  order: Order | null;
  lab: Lab | null;
  pharmacy: Pharmacy | null;
  isLoading: boolean;
  error: string | null;
}

export function useOrderDetails(orderId: string): UseOrderDetailsResult {
  const { orders } = useOrderStore();
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const order = useMemo(() => {
    return orders.find(o => o.id === orderId) || null;
  }, [orders, orderId]);
  
  const lab = useMemo(() => {
    if (!order) return null;
    return labs.find(l => l.id === order.labId) || null;
  }, [labs, order]);
  
  const pharmacy = useMemo(() => {
    if (!order) return null;
    
    // Chercher d'abord dans notre store de pharmacies
    const foundPharmacy = pharmacies.find(p => p.id === order.pharmacyId);
    if (foundPharmacy) return foundPharmacy;
    
    // Si non trouvé, essayer avec les IDs fixes NextAuth
    if (order.pharmacyId.startsWith('pharmacy-')) {
      const pharmacyNames = {
        'pharmacy-1': 'Pharmacie Centrale',
        'pharmacy-2': 'Pharmacie du Port',
        'pharmacy-3': 'Pharmacie des Alpes',
        'pharmacy-4': 'Pharmacie de la Gare',
        'pharmacy-5': 'Pharmacie de l\'Étoile'
      };
      
      const name = pharmacyNames[order.pharmacyId as keyof typeof pharmacyNames];
      if (name) {
        return {
          id: order.pharmacyId,
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          password: 'password',
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    }
    
    return null;
  }, [pharmacies, order]);
  
  useEffect(() => {
    let mounted = true;
    
    const loadOrder = async () => {
      try {
        // Simuler un chargement pour démontrer l'état de chargement
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (!mounted) return;
        
        if (!order) {
          setError('Commande introuvable');
        }
        
        setIsLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError('Erreur lors du chargement de la commande');
        setIsLoading(false);
      }
    };
    
    loadOrder();
    
    return () => {
      mounted = false;
    };
  }, [order]);
  
  return {
    order,
    lab,
    pharmacy,
    isLoading,
    error
  };
}