import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderStatus, LabStatistics } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { usePharmacyStore } from './pharmacyStore';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  
  // Actions existantes
  addOrder: (
    labId: string, 
    pharmacyId: string,
    fileName: string, 
    rawContent: string, 
    parsedData: Array<{ code: string; quantity: number }>,
    referencesCount: number,
    boxesCount: number
  ) => string;
  getOrdersByLabId: (labId: string) => Order[];
  getOrdersByPharmacyId: (pharmacyId: string) => Order[];
  getOrdersByLabAndPharmacy: (labId: string, pharmacyId: string) => Order[];
  removeOrder: (id: string) => void;
  getLabStatistics: (labId: string) => LabStatistics;
  getAllLabsStatistics: () => Record<string, LabStatistics>;
  
  // Nouvelles actions pour le workflow
  updateOrderStatus: (
    id: string, 
    status: OrderStatus, 
    reviewedBy?: string, 
    reviewNote?: string
  ) => void;
  setExpectedDeliveryDate: (id: string, date: Date) => void;
  markAsDelivered: (id: string, deliveredAt?: Date) => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,

      addOrder: (labId, pharmacyId, fileName, rawContent, parsedData, referencesCount, boxesCount) => {
        const newOrder: Order = {
          id: uuidv4(),
          labId,
          pharmacyId,
          fileName,
          createdAt: new Date(),
          rawContent,
          parsedData,
          referencesCount,
          boxesCount,
          status: 'pending' // Toutes les nouvelles commandes sont en attente d'approbation
        };

        set((state) => ({
          orders: [...state.orders, newOrder],
        }));
        
        return newOrder.id;
      },

      // Actions existantes conservées...
      getOrdersByLabId: (labId) => {
        const { orders } = get();
        return orders.filter(order => order.labId === labId);
      },

      getOrdersByPharmacyId: (pharmacyId) => {
        const { orders } = get();
        return orders.filter(order => order.pharmacyId === pharmacyId);
      },

      getOrdersByLabAndPharmacy: (labId, pharmacyId) => {
        const { orders } = get();
        return orders.filter(order => order.labId === labId && order.pharmacyId === pharmacyId);
      },

      removeOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }));
      },

      // Nouvelles actions pour le workflow
      updateOrderStatus: (id, status, reviewedBy, reviewNote) => {
        set((state) => {
          const now = new Date();
          
          return {
            orders: state.orders.map(order => {
              if (order.id === id) {
                return {
                  ...order,
                  status,
                  reviewedAt: now,
                  reviewedBy,
                  reviewNote,
                  // Si la commande est approuvée, elle passe automatiquement en attente de livraison
                  ...(status === 'approved' ? { status: 'awaiting_delivery' } : {})
                };
              }
              return order;
            }),
          };
        });
      },

      setExpectedDeliveryDate: (id, date) => {
        set((state) => ({
          orders: state.orders.map(order => {
            if (order.id === id) {
              return {
                ...order,
                expectedDeliveryDate: date,
                // Ne mettre à jour le statut que si c'est au bon stade du workflow
                ...(order.status === 'approved' ? { status: 'awaiting_delivery' } : {})
              };
            }
            return order;
          }),
        }));
      },

      markAsDelivered: (id, deliveredAt) => {
        set((state) => ({
          orders: state.orders.map(order => {
            if (order.id === id) {
              return {
                ...order,
                status: 'delivered',
                deliveredAt: deliveredAt || new Date()
              };
            }
            return order;
          }),
        }));
      },

      getOrdersByStatus: (status) => {
        const { orders } = get();
        return orders.filter(order => order.status === status);
      },
      
      getLabStatistics: (labId: string) => {
        const { orders } = get();
        const labOrders = orders.filter(order => order.labId === labId);
        
        // Assurer que toutes les dates sont correctement converties en objets Date
        const orderDates = labOrders.map(order => {
          return order.createdAt instanceof Date 
            ? order.createdAt 
            : new Date(order.createdAt);
        });
        
        // Trier les dates avec une vérification
        const sortedDates = [...orderDates].sort((a, b) => {
          const dateA = a instanceof Date ? a : new Date(a);
          const dateB = b instanceof Date ? b : new Date(b);
          
          return dateA.getTime() - dateB.getTime();
        });
        
        // Calculer le nombre total de références et de boîtes
        // Supporter à la fois referencesCount (nouveau) et itemCount (ancien)
        const totalReferences = labOrders.reduce((sum, order: any) => {
          if ('referencesCount' in order) {
            return sum + order.referencesCount;
          } else if ('itemCount' in order) {
            return sum + (order.itemCount || 0);
          }
          return sum;
        }, 0);
        
        // Supporter à la fois boxesCount (nouveau) et itemCount (ancien)
        const totalBoxes = labOrders.reduce((sum, order : any) => {
          if ('boxesCount' in order) {
            return sum + order.boxesCount;
          } else if ('itemCount' in order) {
            return sum + (order.itemCount || 0);
          }
          return sum;
        }, 0);
        
        // Récupérer les pharmacies uniques qui ont passé commande
        const pharmacyIds = [...new Set(labOrders.map(order => order.pharmacyId))];
        
        // Mapping des IDs fixes NextAuth vers les noms de pharmacies
        const fixedIdMapping: Record<string, string> = {
          "pharmacy-1": "Pharmacie Centrale",
          "pharmacy-2": "Pharmacie du Port",
          "pharmacy-3": "Pharmacie des Alpes",
          "pharmacy-4": "Pharmacie de la Gare",
          "pharmacy-5": "Pharmacie de l'Étoile"
        };
        
        // Compiler les informations sur les pharmacies
        const pharmacies = pharmacyIds.map(id => {
          const pharmacyOrders = labOrders.filter(order => order.pharmacyId === id);
          
          // Essayer de trouver un nom dans notre mappage fixe d'abord
          let pharmacyName = fixedIdMapping[id] || "";
          
          // Si pas trouvé, essayer de trouver dans le store des pharmacies
          if (!pharmacyName) {
            try {
              const pharmacyStore = usePharmacyStore.getState();
              const pharmacy = pharmacyStore.getPharmacyById(id);
              if (pharmacy) {
                pharmacyName = pharmacy.name;
              }
            } catch (error) {
              console.error("Erreur lors de la récupération de la pharmacie:", error);
            }
          }
          
          // Si toujours pas trouvé, utiliser un nom générique
          if (!pharmacyName) {
            pharmacyName = `Pharmacie ${id.slice(0, 5)}`;
          }
          
          return {
            id,
            name: pharmacyName,
            orderCount: pharmacyOrders.length
          };
        });
        
        return {
          labId,
          orderCount: labOrders.length,
          firstOrderDate: sortedDates.length > 0 ? sortedDates[0] : null,
          lastOrderDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
          totalReferences,
          totalBoxes,
          totalItems: totalReferences, // Pour compatibilité avec l'ancien format
          pharmacyCount: pharmacyIds.length,
          pharmacies
        };
      },

      getAllLabsStatistics: () => {
        const { orders } = get();
        const labIds = [...new Set(orders.map(order => order.labId))];
        
        return labIds.reduce((stats, labId) => {
          stats[labId] = get().getLabStatistics(labId);
          return stats;
        }, {} as Record<string, LabStatistics>);
      },
    }),
    {
      name: 'pharm-orders-storage',
      partialize: (state) => {
        // Convertit les dates en chaînes lors de la sérialisation
        const serializedOrders = state.orders.map(order => ({
          ...order,
          createdAt: order.createdAt instanceof Date 
            ? order.createdAt.toISOString() 
            : order.createdAt,
          reviewedAt: order.reviewedAt instanceof Date 
            ? order.reviewedAt.toISOString() 
            : order.reviewedAt,
          expectedDeliveryDate: order.expectedDeliveryDate instanceof Date 
            ? order.expectedDeliveryDate.toISOString() 
            : order.expectedDeliveryDate,
          deliveredAt: order.deliveredAt instanceof Date 
            ? order.deliveredAt.toISOString() 
            : order.deliveredAt
        }));
        
        return {
          ...state,
          orders: serializedOrders
        };
      },
      onRehydrateStorage: () => (state) => {
        // Reconvertit les chaînes en dates lors de la désérialisation
        if (state && state.orders) {
          state.orders = state.orders.map(order => ({
            ...order,
            createdAt: typeof order.createdAt === 'string' 
              ? new Date(order.createdAt) 
              : order.createdAt,
            reviewedAt: typeof order.reviewedAt === 'string' 
              ? new Date(order.reviewedAt) 
              : order.reviewedAt,
            expectedDeliveryDate: typeof order.expectedDeliveryDate === 'string' 
              ? new Date(order.expectedDeliveryDate) 
              : order.expectedDeliveryDate,
            deliveredAt: typeof order.deliveredAt === 'string' 
              ? new Date(order.deliveredAt) 
              : order.deliveredAt
          }));
        }
      }
    }
  )
);