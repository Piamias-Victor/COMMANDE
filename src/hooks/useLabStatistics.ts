import { useState, useMemo, useCallback } from 'react';
import { useLabStore } from '@/store/labStore';
import { useOrderStore } from '@/store/orderStore';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { LabStatistics } from '@/types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export function useLabStatistics(labId?: string) {
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  const { orders, getLabStatistics, getAllLabsStatistics } = useOrderStore();
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  
  // Obtenir les statistiques selon qu'on filtre sur un labo ou tous les labos
  const stats = useMemo<Record<string, LabStatistics>>(() => {
    if (labId) {
      return { [labId]: getLabStatistics(labId) };
    }
    return getAllLabsStatistics();
  }, [labId, orders, getLabStatistics, getAllLabsStatistics]);

  // Map des noms de labo pour l'affichage
  const labsMap = useMemo(() => {
    return labs.reduce((acc, lab) => {
      acc[lab.id] = lab.name;
      return acc;
    }, {} as Record<string, string>);
  }, [labs]);

  // Map des noms de pharmacies pour l'affichage
  const pharmaciesMap = useMemo(() => {
    const map: Record<string, string> = {};
    
    // Ajouter toutes les pharmacies connues
    pharmacies.forEach(pharmacy => {
      map[pharmacy.id] = pharmacy.name;
    });
    
    // Ajouter les mappages pour les IDs NextAuth
    map["pharmacy-1"] = "Pharmacie Centrale";
    map["pharmacy-2"] = "Pharmacie du Port";
    map["pharmacy-3"] = "Pharmacie des Alpes";
    map["pharmacy-4"] = "Pharmacie de la Gare";
    map["pharmacy-5"] = "Pharmacie de l'Étoile";
    
    return map;
  }, [pharmacies]);

  // Vérifier s'il y a des stats à afficher
  const hasStats = Object.keys(stats).length > 0;
  
  // Calcul des valeurs maximales pour les barres de progression
  const maxValues = useMemo(() => {
    if (!hasStats) return { references: 0, boxes: 0, orders: 0, pharmacies: 0 };
    
    return {
      references: Math.max(...Object.values(stats).map(stat => stat.totalReferences || 0)),
      boxes: Math.max(...Object.values(stats).map(stat => stat.totalBoxes || 0)),
      orders: Math.max(...Object.values(stats).map(stat => stat.orderCount || 0)),
      pharmacies: Math.max(...Object.values(stats).map(stat => stat.pharmacyCount || 0))
    };
  }, [stats, hasStats]);
  
  // Fonction pour calculer les pourcentages
  const calculatePercentage = useCallback((value: number, maxValue: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }, []);

  // Fonction pour télécharger les CSV
  const handleDownloadAllForPharmacy = useCallback((labId: string, pharmacyId: string, pharmacyName: string) => {
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
  }, [orders, labsMap]);

  // Calcul des totaux pour toutes les statistiques
  const totals = useMemo(() => {
    if (!hasStats) return { orders: 0, pharmacies: 0, references: 0, boxes: 0 };
    
    const uniquePharmacies = new Set(
      Object.values(stats).flatMap(stat => stat.pharmacies.map(p => p.id))
    );
    
    return {
      orders: Object.values(stats).reduce((sum, stat) => sum + stat.orderCount, 0),
      pharmacies: uniquePharmacies.size,
      references: Object.values(stats).reduce((sum, stat) => sum + stat.totalReferences, 0),
      boxes: Object.values(stats).reduce((sum, stat) => sum + stat.totalBoxes, 0)
    };
  }, [stats, hasStats]);

  // Fonction pour formater les dates en toute sécurité
  const formatDate = useCallback((dateInput: Date | null | string) => {
    if (!dateInput) return 'N/A';
    try {
      const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return 'Date invalide';
    }
  }, []);

  return {
    stats,
    hasStats,
    labsMap,
    pharmaciesMap,
    maxValues,
    totals,
    downloadingOrderId,
    calculatePercentage,
    handleDownloadAllForPharmacy,
    formatDate
  };
}