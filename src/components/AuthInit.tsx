// src/components/AuthInit.tsx
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePharmacyStore } from '@/store/pharmacyStore';

/**
 * Composant qui initialise l'état de l'application en fonction de la session
 * Cela inclut le chargement des pharmacies et la sélection de la pharmacie active
 */
export const AuthInit: React.FC = () => {
  const { data: session, status } = useSession();
  const { initialize, selectPharmacy, getPharmacyByEmail } = usePharmacyStore();
  
  useEffect(() => {
    // Initialiser les pharmacies par défaut
    initialize();
    
    // Si l'utilisateur est authentifié, sélectionner la pharmacie correspondante
    if (status === 'authenticated' && session?.user?.email) {
      const pharmacy = getPharmacyByEmail(session.user.email);
      if (pharmacy) {
        selectPharmacy(pharmacy.id);
      } else if (session.user.id) {
        // Fallback sur l'ID de session si l'email ne correspond pas
        selectPharmacy(session.user.id);
      }
    }
  }, [status, session, initialize, selectPharmacy, getPharmacyByEmail]);
  
  // Ce composant ne rend rien, il ne fait qu'initialiser l'état
  return null;
};