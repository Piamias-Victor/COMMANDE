import { useState, useMemo, useCallback } from 'react';
import { useLabStore } from '@/store/labStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { useOrderStore } from '@/store/orderStore';
import { Order } from '@/types';
import toast from 'react-hot-toast';

type SortField = 'date' | 'fileName' | 'referencesCount' | 'boxesCount';
type SortDirection = 'asc' | 'desc';

export function useOrdersTable() {
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  const { orders, removeOrder } = useOrderStore();
  
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedLabId, setSelectedLabId] = useState<string | 'all'>('all');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | 'all'>('all');
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Lab name mapping
  const labsMap = useMemo(() => {
    return labs.reduce((acc, lab) => {
      acc[lab.id] = lab.name;
      return acc;
    }, {} as Record<string, string>);
  }, [labs]);

  // Pharmacy name mapping
  const getPharmacyName = useCallback((id: string) => {
    // Try direct match in pharmacies list
    const pharmacy = pharmacies.find(p => p.id === id);
    if (pharmacy) return pharmacy.name;
    
    // Handle NextAuth format pharmacy IDs
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
  }, [pharmacies]);

  // Filtered orders based on lab/pharmacy selection
  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      (selectedLabId === 'all' || order.labId === selectedLabId) &&
      (selectedPharmacyId === 'all' || order.pharmacyId === selectedPharmacyId)
    );
  }, [orders, selectedLabId, selectedPharmacyId]);

  // Sorted orders based on sort field and direction
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
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

  // Handle sorting change
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  // Handle file download
  const handleDownload = useCallback((order: Order) => {
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
  }, []);

  // Handle order deletion
  const handleDelete = useCallback((id: string) => {
    setIsDeleting(id);
    
    setTimeout(() => {
      removeOrder(id);
      toast.success('Commande supprimée avec succès');
      setIsDeleting(null);
    }, 300);
  }, [removeOrder]);

  // Calculate totals for summary
  const totals = useMemo(() => {
    return {
      orderCount: sortedOrders.length,
      references: sortedOrders.reduce((sum, order) => sum + order.referencesCount, 0),
      boxes: sortedOrders.reduce((sum, order) => sum + order.boxesCount, 0)
    };
  }, [sortedOrders]);

  return {
    labs,
    pharmacies,
    orders,
    sortField,
    sortDirection,
    selectedLabId,
    setSelectedLabId,
    selectedPharmacyId,
    setSelectedPharmacyId,
    isDownloading,
    isDeleting,
    labsMap,
    getPharmacyName,
    filteredOrders,
    sortedOrders,
    totals,
    handleSort,
    handleDownload,
    handleDelete
  };
}