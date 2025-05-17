// src/components/features/OrderBasicInfo.tsx (mise à jour)
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Order, Lab, Pharmacy } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface OrderBasicInfoProps {
  order: Order;
  lab: Lab | null;
  pharmacy: Pharmacy | null;
}

export const OrderBasicInfo: React.FC<OrderBasicInfoProps> = ({ order, lab, pharmacy }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Fonction pour formater les dates
  const formatDate = (date: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMMM yyyy, HH:mm', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return 'Date invalide';
    }
  };
  
  // Fonction pour générer le badge de statut
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      awaiting_delivery: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
    };
    
    const labels = {
      pending: 'En attente',
      approved: 'Approuvée',
      awaiting_delivery: 'En attente de livraison',
      rejected: 'Rejetée',
      delivered: 'Livrée'
    };
    
    const style = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    const label = labels[status as keyof typeof labels] || status;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
        {label}
      </span>
    );
  };
  
  const handleDownload = () => {
    setIsDownloading(true);
    
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
        setIsDownloading(false);
      }
    }, 500);
  };
  
  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-2">
            {getStatusBadge(order.status)}
            <h2 className="text-xl font-semibold">{order.fileName}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Laboratoire</p>
              <p className="font-medium">{lab?.name || 'Inconnu'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pharmacie</p>
              <p className="font-medium">{pharmacy?.name || 'Inconnue'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date de création</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour</p>
              <p className="font-medium">
                {order.reviewedAt ? formatDate(order.reviewedAt) : 'N/A'}
              </p>
            </div>
          </div>
          
          {/* Informations supplémentaires selon le statut */}
          {order.status === 'awaiting_delivery' && order.expectedDeliveryDate && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-medium">Livraison prévue le:</span> {formatDate(order.expectedDeliveryDate)}
              </p>
            </div>
          )}
          
          {order.status === 'delivered' && order.deliveredAt && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-300">
                <span className="font-medium">Livrée le:</span> {formatDate(order.deliveredAt)}
              </p>
            </div>
          )}
          
          {order.status === 'rejected' && order.reviewNote && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-300">
                <span className="font-medium">Motif de rejet:</span> {order.reviewNote}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:items-end gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-lg font-bold">{order.referencesCount}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Références</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-lg font-bold">{order.boxesCount}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Boîtes</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              loading={isDownloading}
              disabled={isDownloading}
            >
              Télécharger CSV
            </Button>
            
            <Button variant="outline">
              Exporter PDF
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};