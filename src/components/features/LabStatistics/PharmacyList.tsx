import React from 'react';
import { Button } from '@/components/ui/Button';

interface PharmacyListProps {
  pharmacies: Array<{
    id: string;
    name?: string;
    orderCount: number;
  }>;
  pharmaciesMap: Record<string, string>;
  downloadingOrderId: string | null;
  labId: string;
  onDownload: (labId: string, pharmacyId: string, pharmacyName: string) => void;
}

export const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  pharmaciesMap,
  downloadingOrderId,
  labId,
  onDownload
}) => {
  if (!pharmacies || pharmacies.length === 0) {
    return null;
  }

  const getPharmacyName = (pharmacy: { id: string; name?: string }) => {
    return pharmaciesMap[pharmacy.id] || pharmacy.name || `Pharmacie ${pharmacy.id.slice(0, 5)}`;
  };

  return (
    <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
      <h5 className="font-medium mb-2">Pharmacies ({pharmacies.length})</h5>
      <div className="space-y-2">
        {pharmacies.map(pharmacy => (
          <div 
            key={pharmacy.id}
            className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded"
          >
            <div>
              <p className="font-medium">{getPharmacyName(pharmacy)}</p>
              <p className="text-xs text-gray-500">
                {pharmacy.orderCount} commande(s)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(labId, pharmacy.id, getPharmacyName(pharmacy))}
              loading={downloadingOrderId === pharmacy.id}
              disabled={downloadingOrderId !== null}
            >
              Télécharger
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};