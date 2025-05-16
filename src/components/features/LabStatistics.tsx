import React, { useMemo, useState } from 'react';
import { useLabStore } from '@/store/labStore';
import { useOrderStore } from '@/store/orderStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface LabStatisticsProps {
  labId?: string;
}

export const LabStatistics: React.FC<LabStatisticsProps> = ({ labId }) => {
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  const { orders, getLabStatistics, getAllLabsStatistics } = useOrderStore();
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  
  const stats = useMemo(() => {
    if (labId) {
      return { [labId]: getLabStatistics(labId) };
    }
    return getAllLabsStatistics();
  }, [labId, orders, getLabStatistics, getAllLabsStatistics]);
  
  const labsMap = useMemo(() => {
    return labs.reduce((acc, lab) => {
      acc[lab.id] = lab.name;
      return acc;
    }, {} as Record<string, string>);
  }, [labs]);

  // Créer un mappage pour les noms de pharmacies
  const pharmaciesMap = useMemo(() => {
    const map: Record<string, string> = {};
    
    // Ajouter toutes les pharmacies connues
    pharmacies.forEach(pharmacy => {
      map[pharmacy.id] = pharmacy.name;
    });
    
    // Ajouter aussi les mappages pour les IDs de NextAuth
    // basés sur les IDs fixes utilisés dans l'API d'authentification
    map["pharmacy-1"] = "Pharmacie Centrale";
    map["pharmacy-2"] = "Pharmacie du Port";
    map["pharmacy-3"] = "Pharmacie des Alpes";
    map["pharmacy-4"] = "Pharmacie de la Gare";
    map["pharmacy-5"] = "Pharmacie de l'Étoile";
    
    return map;
  }, [pharmacies]);

  const hasStats = Object.keys(stats).length > 0;
  
  const handleDownloadAllForPharmacy = (labId: string, pharmacyId: string, pharmacyName: string) => {
    // Trouver toutes les commandes pour ce lab et cette pharmacie
    const pharmacyOrders = orders.filter(
      order => order.labId === labId && order.pharmacyId === pharmacyId
    );
    
    if (pharmacyOrders.length === 0) {
      toast.error('Aucune commande disponible pour cette pharmacie');
      return;
    }

    setDownloadingOrderId(pharmacyId);
    setTimeout(() => {
      try {
        // Prendre la commande la plus récente
        const latestOrder = [...pharmacyOrders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        const blob = new Blob([latestOrder.rawContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${labsMap[labId] || 'Laboratoire'}_${pharmacyName}_${format(new Date(), 'dd-MM-yyyy')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success(`Fichier CSV pour ${pharmacyName} téléchargé avec succès`);
      } catch (error) {
        toast.error('Erreur lors du téléchargement');
      } finally {
        setDownloadingOrderId(null);
      }
    }, 500);
  };
  
  if (!hasStats) {
    return (
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Aucune statistique disponible</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            Importez des fichiers CSV à partir de la page d'accueil pour visualiser vos statistiques ici.
          </p>
        </div>
      </Card>
    );
  }

  // Calcul du maximum pour les barres de progression
  const maxReferences = Math.max(...Object.values(stats).map(stat => stat.totalReferences || 0));
  const maxBoxes = Math.max(...Object.values(stats).map(stat => stat.totalBoxes || 0));
  const maxOrders = Math.max(...Object.values(stats).map(stat => stat.orderCount || 0));
  const maxPharmacies = Math.max(...Object.values(stats).map(stat => stat.pharmacyCount || 0));

  return (
    <Card>
      <h3 className="text-lg font-medium mb-4">Statistiques des laboratoires</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stats).map(([id, stat]) => {
          const referencesPercentage = maxReferences > 0 ? (stat.totalReferences / maxReferences) * 100 : 0;
          const boxesPercentage = maxBoxes > 0 ? (stat.totalBoxes / maxBoxes) * 100 : 0;
          const orderPercentage = maxOrders > 0 ? (stat.orderCount / maxOrders) * 100 : 0;
          const pharmacyPercentage = maxPharmacies > 0 ? (stat.pharmacyCount / maxPharmacies) * 100 : 0;
          
          // S'assurer que les dates sont correctement formatées
          const formatDate = (dateInput: Date | null | string) => {
            if (!dateInput) return 'N/A';
            try {
              const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
              return format(date, 'dd/MM/yyyy', { locale: fr });
            } catch (error) {
              console.error("Erreur de formatage de date:", error);
              return 'Date invalide';
            }
          };
          
          return (
            <div 
              key={id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow slide-in"
            >
              <h4 className="text-md font-medium mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                {labsMap[id] || 'Laboratoire inconnu'}
              </h4>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Commandes:</span>
                    <span className="text-gray-600 dark:text-gray-400">{stat.orderCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${orderPercentage}%`, transition: 'width 1s ease-in-out' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Pharmacies:</span>
                    <span className="text-gray-600 dark:text-gray-400">{stat.pharmacyCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full"
                      style={{ width: `${pharmacyPercentage}%`, transition: 'width 1s ease-in-out' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Références:</span>
                    <span className="text-gray-600 dark:text-gray-400">{stat.totalReferences}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${referencesPercentage}%`, transition: 'width 1s ease-in-out' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Boîtes:</span>
                    <span className="text-gray-600 dark:text-gray-400">{stat.totalBoxes}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${boxesPercentage}%`, transition: 'width 1s ease-in-out' }}
                    ></div>
                  </div>
                </div>
                
                {stat.pharmacies && stat.pharmacies.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                    <h5 className="font-medium mb-2">Pharmacies ({stat.pharmacyCount})</h5>
                    <div className="space-y-2">
                      {stat.pharmacies.map(pharmacy => (
                        <div 
                          key={pharmacy.id}
                          className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                          <div>
                            <p className="font-medium">
                              {pharmaciesMap[pharmacy.id] || pharmacy.name || `Pharmacie ${pharmacy.id.slice(0, 5)}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {pharmacy.orderCount} commande(s)
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadAllForPharmacy(
                              id, 
                              pharmacy.id, 
                              pharmaciesMap[pharmacy.id] || pharmacy.name || `Pharmacie ${pharmacy.id.slice(0, 5)}`
                            )}
                            loading={downloadingOrderId === pharmacy.id}
                            disabled={downloadingOrderId !== null}
                          >
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {(stat.firstOrderDate || stat.lastOrderDate) && (
                  <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Première commande</p>
                        <p className="font-medium">
                          {formatDate(stat.firstOrderDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Dernière commande</p>
                        <p className="font-medium">
                          {formatDate(stat.lastOrderDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <h4 className="text-sm font-medium mb-2">Totaux</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">Commandes</p>
            <p className="text-lg font-semibold">
              {Object.values(stats).reduce((sum, stat) => sum + stat.orderCount, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Pharmacies actives</p>
            <p className="text-lg font-semibold">
              {/* Calcul du nombre unique de pharmacies à travers tous les laboratoires */}
              {new Set(
                Object.values(stats).flatMap(stat => stat.pharmacies.map(p => p.id))
              ).size}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Références</p>
            <p className="text-lg font-semibold">
              {Object.values(stats).reduce((sum, stat) => sum + stat.totalReferences, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Boîtes</p>
            <p className="text-lg font-semibold">
              {Object.values(stats).reduce((sum, stat) => sum + stat.totalBoxes, 0)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};