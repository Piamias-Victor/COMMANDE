import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Pharmacy } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface PharmacyState {
  pharmacies: Pharmacy[];
  selectedPharmacyId: string | null;
  isLoading: boolean;
  
  // Actions
  addPharmacy: (id: string | null, name: string, email: string, password: string, address?: string) => string;
  selectPharmacy: (id: string | null) => void;
  removePharmacy: (id: string) => void;
  updatePharmacy: (id: string, updates: Partial<Omit<Pharmacy, 'id' | 'createdAt'>>) => void;
  getPharmacyById: (id: string) => Pharmacy | undefined;
  getPharmacyByEmail: (email: string) => Pharmacy | undefined;
  initialize: () => void; // Pour créer les 5 pharmacies par défaut
}

export const usePharmacyStore = create<PharmacyState>()(
  persist(
    (set, get) => ({
      pharmacies: [],
      selectedPharmacyId: null,
      isLoading: false,

      addPharmacy: (id, name, email, password, address) => {
        const newPharmacy: Pharmacy = {
          id: id || uuidv4(), // Utiliser l'ID fourni ou en générer un nouveau
          name,
          email,
          password,
          address,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Vérifier si une pharmacie avec cet ID existe déjà
        const exists = get().pharmacies.some(p => p.id === newPharmacy.id);
        if (exists) {
          // Mettre à jour plutôt qu'ajouter
          set((state) => ({
            pharmacies: state.pharmacies.map(p => 
              p.id === newPharmacy.id ? { ...p, ...newPharmacy } : p
            )
          }));
        } else {
          // Ajouter une nouvelle pharmacie
          set((state) => ({
            pharmacies: [...state.pharmacies, newPharmacy],
            selectedPharmacyId: state.selectedPharmacyId || newPharmacy.id,
          }));
        }
        
        return newPharmacy.id;
      },

      selectPharmacy: (id) => {
        set({ selectedPharmacyId: id });
      },

      removePharmacy: (id) => {
        set((state) => ({
          pharmacies: state.pharmacies.filter((pharmacy) => pharmacy.id !== id),
          selectedPharmacyId: state.selectedPharmacyId === id ? null : state.selectedPharmacyId,
        }));
      },

      updatePharmacy: (id, updates) => {
        set((state) => ({
          pharmacies: state.pharmacies.map((pharmacy) => 
            pharmacy.id === id 
              ? { ...pharmacy, ...updates, updatedAt: new Date() } 
              : pharmacy
          ),
        }));
      },

      getPharmacyById: (id) => {
        return get().pharmacies.find(pharmacy => pharmacy.id === id);
      },

      getPharmacyByEmail: (email) => {
        return get().pharmacies.find(pharmacy => 
          pharmacy.email.toLowerCase() === email.toLowerCase()
        );
      },

      initialize: () => {
        const { pharmacies } = get();
        // N'initialiser que si aucune pharmacie n'existe déjà
        if (pharmacies.length === 0) {
          const defaultPharmacies = [
            { 
              id: "pharmacy-1", // ID fixe correspondant à NextAuth
              name: 'Pharmacie Centrale', 
              email: 'centrale@example.com',
              password: 'password1',
              address: '1 rue Principale, 75001 Paris' 
            },
            { 
              id: "pharmacy-2", // ID fixe correspondant à NextAuth
              name: 'Pharmacie du Port', 
              email: 'port@example.com',
              password: 'password2',
              address: '15 avenue du Port, 13001 Marseille' 
            },
            { 
              id: "pharmacy-3", // ID fixe correspondant à NextAuth
              name: 'Pharmacie des Alpes', 
              email: 'alpes@example.com',
              password: 'password3',
              address: '8 rue Montagne, 38000 Grenoble' 
            },
            { 
              id: "pharmacy-4", // ID fixe correspondant à NextAuth
              name: 'Pharmacie de la Gare', 
              email: 'gare@example.com',
              password: 'password4',
              address: '45 place de la Gare, 67000 Strasbourg' 
            },
            { 
              id: "pharmacy-5", // ID fixe correspondant à NextAuth
              name: 'Pharmacie de l\'Étoile', 
              email: 'etoile@example.com',
              password: 'password5',
              address: '22 boulevard Étoile, 69000 Lyon' 
            },
          ];
          
          defaultPharmacies.forEach(pharmacy => {
            get().addPharmacy(
              pharmacy.id,
              pharmacy.name,
              pharmacy.email,
              pharmacy.password,
              pharmacy.address
            );
          });
        }
      },
    }),
    {
      name: 'pharm-pharmacies-storage',
      partialize: (state) => {
        // Convertit les dates en chaînes lors de la sérialisation
        const serializedPharmacies = state.pharmacies.map(pharmacy => ({
          ...pharmacy,
          createdAt: pharmacy.createdAt instanceof Date 
            ? pharmacy.createdAt.toISOString() 
            : pharmacy.createdAt,
          updatedAt: pharmacy.updatedAt instanceof Date 
            ? pharmacy.updatedAt.toISOString() 
            : pharmacy.updatedAt
        }));
        
        return {
          ...state,
          pharmacies: serializedPharmacies
        };
      },
      onRehydrateStorage: () => (state) => {
        // Reconvertit les chaînes en dates lors de la désérialisation
        if (state && state.pharmacies) {
          state.pharmacies = state.pharmacies.map(pharmacy => ({
            ...pharmacy,
            createdAt: typeof pharmacy.createdAt === 'string' 
              ? new Date(pharmacy.createdAt) 
              : pharmacy.createdAt,
            updatedAt: typeof pharmacy.updatedAt === 'string' 
              ? new Date(pharmacy.updatedAt) 
              : pharmacy.updatedAt
          }));
        }
      }
    }
  )
);