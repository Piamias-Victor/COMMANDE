import React from 'react';
import { Order, Lab, Pharmacy } from '@/types';

interface ExportInfoProps {
  order: Order;
  lab: Lab | null;
  pharmacy: Pharmacy | null;
}

export const ExportInfo: React.FC<ExportInfoProps> = ({ order, lab, pharmacy }) => (
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
);