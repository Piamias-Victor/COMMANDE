// src/components/features/OrdersTable.tsx
import React, { useState, useMemo } from 'react';
import { useLabStore } from '@/store/labStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import Link from 'next/link';

type SortField = 'date' | 'fileName' | 'referencesCount' | 'boxesCount';
type SortDirection = 'asc' | 'desc';

export const OrdersTable: React.FC = () => {
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  const { orders, removeOrder } = useOrderStore();
  
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedLabId, setSelectedLabId] = useState<string | 'all'>('all');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | 'all'>('all');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDownload = (order: any) => {
    setIsDownloading(order.id);
    
    setTimeout(() => {
      try {
        const blob = new Blob([order.rawContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = order.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Fichier téléchargé avec succès');
      } catch (error) {
        toast.error('Erreur lors du téléchargement');
      } finally {
        setIsDownloading(null);
      }
    }, 500);
  };
  
  const handleDelete = (id: string) => {
    setIsDeleting(id);
    
    setTimeout(() => {
      removeOrder(id);
      toast.success('Commande supprimée avec succès');
      setIsDeleting(null);
    }, 300);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      (selectedLabId === 'all' || order.labId === selectedLabId) &&
      (selectedPharmacyId === 'all' || order.pharmacyId === selectedPharmacyId)
    );
  }, [orders, selectedLabId, selectedPharmacyId]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        // S'assurer que nous travaillons avec des objets Date
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        comparison = dateA.getTime() - dateB.getTime();
      } else if (sortField === 'fileName') {
        comparison = a.fileName.localeCompare(b.fileName);
      } else if (sortField === 'referencesCount') {
        comparison = a.referencesCount - b.referencesCount;
      } else if (sortField === 'boxesCount') {
        comparison = a.boxesCount - b.boxesCount;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredOrders, sortField, sortDirection]);

  // Fonction pour formater les dates en toute sécurité
  const formatDate = (dateInput: Date | string) => {
    try {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      console.error("Erreur de formatage de date:", error);
      return 'Date invalide';
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const labsMap = useMemo(() => {
    return labs.reduce((acc, lab) => {
      acc[lab.id] = lab.name;
      return acc;
    }, {} as Record<string, string>);
  }, [labs]);

  // Dans la partie du mappage des pharmacies
  const pharmaciesMap = useMemo(() => {
    const map: Record<string, string> = {};
    
    // Créer un mappage par ID
    pharmacies.forEach(pharmacy => {
      map[pharmacy.id] = pharmacy.name;
    });
    
    // Fonction qui retourne le nom d'une pharmacie par ID
    return (id: string) => {
      // Essayer de trouver par ID direct
      if (map[id]) return map[id];
      
      // Si l'ID commence par "pharmacy-" (format NextAuth)
      if (id.startsWith('pharmacy-')) {
        const index = parseInt(id.split('-')[1]);
        if (index >= 1 && index <= 5) {
          const names = [
            'Pharmacie Centrale',
            'Pharmacie du Port',
            'Pharmacie des Alpes',
            'Pharmacie de la Gare',
            'Pharmacie de l\'Étoile'
          ];
          return names[index - 1];
        }
      }
      
      return 'Pharmacie inconnue';
    };
  }, [pharmacies]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (orders.length === 0) {
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">Aucune commande disponible</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            Importez des fichiers CSV à partir de la page d'accueil pour visualiser vos commandes ici.
          </p>
        </div>
      </Card>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <Card>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-lg font-medium">Liste des commandes</h3>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <select
              className="shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block sm:text-sm p-2"
              value={selectedLabId}
              onChange={(e) => setSelectedLabId(e.target.value as string | 'all')}
            >
              <option value="all">Tous les laboratoires</option>
              {labs.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.name}
                </option>
              ))}
            </select>
            
            <select
              className="shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block sm:text-sm p-2"
              value={selectedPharmacyId}
              onChange={(e) => setSelectedPharmacyId(e.target.value as string | 'all')}
            >
              <option value="all">Toutes les pharmacies</option>
              {pharmacies.map((pharmacy) => (
                <option key={pharmacy.id} value={pharmacy.id}>
                  {pharmacy.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="empty-state py-8">
          <p className="text-gray-500 text-sm">
            Aucune commande trouvée pour les filtres sélectionnés
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-medium">Liste des commandes</h3>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <select
            className="shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block sm:text-sm p-2 transition-colors"
            value={selectedLabId}
            onChange={(e) => setSelectedLabId(e.target.value as string | 'all')}
          >
            <option value="all">Tous les laboratoires</option>
            {labs.map((lab) => (
              <option key={lab.id} value={lab.id}>
                {lab.name}
              </option>
            ))}
          </select>
          
          <select
            className="shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block sm:text-sm p-2 transition-colors"
            value={selectedPharmacyId}
            onChange={(e) => setSelectedPharmacyId(e.target.value as string | 'all')}
          >
            <option value="all">Toutes les pharmacies</option>
            {pharmacies.map((pharmacy) => (
              <option key={pharmacy.id} value={pharmacy.id}>
                {pharmacy.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={() => handleSort('date')}
              >
                Date {renderSortIcon('date')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={() => handleSort('fileName')}
              >
                Fichier {renderSortIcon('fileName')}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Laboratoire
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pharmacie
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={() => handleSort('referencesCount')}
              >
                Références {renderSortIcon('referencesCount')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                onClick={() => handleSort('boxesCount')}
              >
                Boîtes {renderSortIcon('boxesCount')}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {sortedOrders.map((order) => (
              <tr 
                key={order.id} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isDeleting === order.id ? 'opacity-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {order.fileName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {labsMap[order.labId] || 'Inconnu'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {pharmaciesMap(order.pharmacyId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {order.referencesCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {order.boxesCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Détails
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(order)}
                      loading={isDownloading === order.id}
                      disabled={isDownloading !== null || isDeleting !== null}
                    >
                      Télécharger
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDelete(order.id)}
                      loading={isDeleting === order.id}
                      disabled={isDownloading !== null || isDeleting !== null}
                    >
                      Supprimer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 px-6 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 rounded-b-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>Total: {sortedOrders.length} commande(s)</div>
          <div className="mt-2 sm:mt-0">
            <span className="mr-4">
              <span className="font-medium">{sortedOrders.reduce((sum, order) => sum + order.referencesCount, 0)}</span> références
            </span>
            <span>
              <span className="font-medium">{sortedOrders.reduce((sum, order) => sum + order.boxesCount, 0)}</span> boîtes
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};