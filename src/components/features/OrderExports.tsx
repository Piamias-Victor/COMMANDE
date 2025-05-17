// src/components/features/OrderExports.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Order, Lab, Pharmacy } from '@/types';
import toast from 'react-hot-toast';

interface OrderExportsProps {
  order: Order;
  lab: Lab | null;
  pharmacy: Pharmacy | null;
}

export const OrderExports: React.FC<OrderExportsProps> = ({ order, lab, pharmacy }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  
  const handleExportCSV = () => {
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
  };
  
  const handleExportPDF = () => {
    setIsExporting('pdf');
    
    setTimeout(() => {
      // Simuler l'export PDF
      toast.success('Fonction d\'export PDF à implémenter');
      setIsExporting(null);
    }, 500);
  };
  
  const handleExportExcel = () => {
    setIsExporting('excel');
    
    setTimeout(() => {
      // Simuler l'export Excel
      toast.success('Fonction d\'export Excel à implémenter');
      setIsExporting(null);
    }, 500);
  };
  
  const handleShare = () => {
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
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Exporter et partager</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          onClick={handleExportCSV}
          loading={isExporting === 'csv'}
          disabled={isExporting !== null}
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export CSV
          </span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleExportPDF}
          loading={isExporting === 'pdf'}
          disabled={isExporting !== null}
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleExportExcel}
          loading={isExporting === 'excel'}
          disabled={isExporting !== null}
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </span>
        </Button>
        
        <Button
          variant="outline"
          onClick={handleShare}
          loading={isExporting === 'share'}
          disabled={isExporting !== null}
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Partager
          </span>
        </Button>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium mb-2 text-gray-500">Informations supplémentaires pour l'export</h4>
        <div className="text-sm">
          <p><strong>Laboratoire:</strong> {lab?.name || 'Inconnu'}</p>
          <p><strong>Pharmacie:</strong> {pharmacy?.name || 'Inconnue'}</p>
          <p><strong>Date de commande:</strong> {new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
          <p><strong>Nombre de références:</strong> {order.referencesCount}</p>
          <p><strong>Nombre de boîtes:</strong> {order.boxesCount}</p>
        </div>
      </div>
    </Card>
  );
};