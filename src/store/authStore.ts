import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePharmacyStore } from './pharmacyStore';

interface AuthState {
  currentPharmacyId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentPharmacy: () => any | null; // Return Pharmacy object
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentPharmacyId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        // Ajouter un petit délai pour s'assurer que l'UI se met à jour
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
          // Récupérer les pharmacies depuis le store
          const pharmacyStore = usePharmacyStore.getState();
          
          // Afficher les pharmacies pour débogage (à supprimer après)
          console.log("Pharmacies disponibles:", pharmacyStore.pharmacies);
          
          const pharmacy = pharmacyStore.pharmacies.find(
            p => p.email.toLowerCase() === email.toLowerCase() && p.password === password
          );
          
          if (pharmacy) {
            console.log("Pharmacie trouvée:", pharmacy);
            
            // Définir également la pharmacie active dans le store des pharmacies
            pharmacyStore.selectPharmacy(pharmacy.id);
            
            // Mettre à jour notre état après avoir défini la pharmacie
            set({ 
              isAuthenticated: true,
              currentPharmacyId: pharmacy.id,
              isLoading: false,
              error: null
            });
            
            return true;
          } else {
            console.log("Aucune correspondance trouvée pour:", email, password);
            
            set({
              isAuthenticated: false,
              currentPharmacyId: null,
              isLoading: false,
              error: 'Email ou mot de passe incorrect'
            });
            return false;
          }
        } catch (error) {
          console.error("Erreur de connexion:", error);
          
          set({
            isAuthenticated: false,
            currentPharmacyId: null,
            isLoading: false,
            error: 'Une erreur est survenue lors de la connexion'
          });
          return false;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentPharmacyId: null,
          error: null
        });
        
        // Réinitialiser la pharmacie active dans le store des pharmacies
        const pharmacyStore = usePharmacyStore.getState();
        pharmacyStore.selectPharmacy(null);
      },

      getCurrentPharmacy: () => {
        const { currentPharmacyId } = get();
        if (!currentPharmacyId) return null;
        
        const pharmacyStore = usePharmacyStore.getState();
        return pharmacyStore.getPharmacyById(currentPharmacyId);
      }
    }),
    {
      name: 'pharm-auth-storage',
    }
  )
);