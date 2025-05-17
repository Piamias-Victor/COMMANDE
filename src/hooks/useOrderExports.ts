import { useState, useCallback } from 'react';
import { Order, Lab, Pharmacy } from '@/types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

type ExportType = 'csv' | 'pdf' | 'excel' | 'share';

export function useOrderExports(order: Order, lab: Lab | null, pharmacy: Pharmacy | null) {
  const [isExporting, setIsExporting] = useState<ExportType | null>(null);
  
  const handleExportCSV = useCallback(() => {
    setIsExporting('csv');
    
    setTimeout(() => {
      try {
        const blob = new Blob([order.rawContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${order.fileName || `commande-${order.id.substring(0, 8)}`}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Fichier CSV téléchargé avec succès');
      } catch (error) {
        toast.error('Erreur lors de l\'export CSV');
      } finally {
        setIsExporting(null);
      }
    }, 500);
  }, [order.fileName, order.id, order.rawContent]);
  
  const handleExportPDF = useCallback(() => {
    setIsExporting('pdf');
    
    setTimeout(() => {
      // Simuler l'export PDF
      toast.success('Fonction d\'export PDF à implémenter');
      setIsExporting(null);
    }, 500);
  }, []);
  
  const handleExportExcel = useCallback(() => {
    setIsExporting('excel');
    
    setTimeout(() => {
      // Simuler l'export Excel
      toast.success('Fonction d\'export Excel à implémenter');
      setIsExporting(null);
    }, 500);
  }, []);
  
  const handleShare = useCallback(() => {
    setIsExporting('share');
    
    setTimeout(() => {
      // Simuler le partage
      const tempInput = document.createElement('input');
      tempInput.value = `${window.location.origin}/orders/${order.id}`;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      toast.success('Lien de la commande copié dans le presse-papier');
      setIsExporting(null);
    }, 500);
  }, [order.id]);
  
  return {
    isExporting,
    handleExportCSV,
    handleExportPDF,
    handleExportExcel,
    handleShare
  };
}