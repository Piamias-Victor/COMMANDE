import React from 'react';
import { StatCard } from './StatCard';
import { PharmacyList } from './PharmacyList';
import { LabStatistics } from '@/types';

interface LabCardProps {
  labId: string;
  labName: string;
  stat: LabStatistics;
  maxValues: {
    references: number;
    boxes: number;
    orders: number;
    pharmacies: number;
  };
  pharmaciesMap: Record<string, string>;
  downloadingOrderId: string | null;
  onDownload: (labId: string, pharmacyId: string, pharmacyName: string) => void;
  formatDate: (date: Date | null | string) => string;
}

export const LabCard: React.FC<LabCardProps> = ({
  labId,
  labName,
  stat,
  maxValues,
  pharmaciesMap,
  downloadingOrderId,
  onDownload,
  formatDate
}) => {
  return (
    <div 
      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow slide-in"
    >
      <h4 className="text-md font-medium mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
        {labName}
      </h4>
      <div className="space-y-4 text-sm">
        <StatCard 
          label="Commandes" 
          value={stat.orderCount} 
          maxValue={maxValues.orders} 
          color="blue" 
        />
        
        <StatCard 
          label="Pharmacies" 
          value={stat.pharmacyCount} 
          maxValue={maxValues.pharmacies} 
          color="pink" 
        />
        
        <StatCard 
          label="Références" 
          value={stat.totalReferences} 
          maxValue={maxValues.references} 
          color="purple" 
        />
        
        <StatCard 
          label="Boîtes" 
          value={stat.totalBoxes} 
          maxValue={maxValues.boxes} 
          color="green" 
        />
        
        <PharmacyList 
          pharmacies={stat.pharmacies}
          pharmaciesMap={pharmaciesMap}
          downloadingOrderId={downloadingOrderId}
          labId={labId}
          onDownload={onDownload}
        />
        
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
};