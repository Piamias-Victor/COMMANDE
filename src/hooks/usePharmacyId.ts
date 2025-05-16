import { useSession } from 'next-auth/react';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { useMemo } from 'react';

export function usePharmacyId() {
  const { data: session } = useSession();
  const { pharmacies } = usePharmacyStore();
  
  return useMemo(() => {
    if (!session?.user?.email) return null;
    
    // Chercher la pharmacie correspondante par email
    const pharmacy = pharmacies.find(p => 
      p.email.toLowerCase() === session.user.email.toLowerCase()
    );
    
    // Si trouvé, retourner son ID
    if (pharmacy) return pharmacy.id;
    
    // Chercher si une pharmacie existe avec l'ID de session
    const pharmacyById = pharmacies.find(p => p.id === session.user.id);
    if (pharmacyById) return pharmacyById.id;
    
    // Sinon, initialiser cette pharmacie dans le store
    // Ceci est optionnel selon votre logique d'application
    
    // Retourner l'ID de session comme fallback
    return session.user.id;
  }, [session, pharmacies]);
}