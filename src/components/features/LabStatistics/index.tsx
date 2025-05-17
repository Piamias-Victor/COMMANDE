import React from 'react';
import { Card } from '@/components/ui/Card';
import { useLabStatistics } from '@/hooks/useLabStatistics';
import { LabCard } from './LabCard';
import { TotalsSummary } from './TotalsSummary';
import { EmptyState } from './EmptyState';

interface LabStatisticsProps {
  labId?: string;
}

export const LabStatistics: React.FC<LabStatisticsProps> = ({ labId }) => {
  const {
    stats,
    hasStats,
    labsMap,
    pharmaciesMap,
    maxValues,
    totals,
    downloadingOrderId,
    handleDownloadAllForPharmacy,
    formatDate
  } = useLabStatistics(labId);
  
  if (!hasStats) {
    return <EmptyState />;
  }

  return (
    <Card>
      <h3 className="text-lg font-medium mb-4">Statistiques des laboratoires</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(stats).map(([id, stat]) => (
          <LabCard 
            key={id}
            labId={id}
            labName={labsMap[id] || 'Laboratoire inconnu'}
            stat={stat}
            maxValues={maxValues}
            pharmaciesMap={pharmaciesMap}
            downloadingOrderId={downloadingOrderId}
            onDownload={handleDownloadAllForPharmacy}
            formatDate={formatDate}
          />
        ))}
      </div>
      
      <TotalsSummary totals={totals} />
    </Card>
  );
};