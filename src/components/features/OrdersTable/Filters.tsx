import React from 'react';

interface FiltersProps {
  labs: any[];
  pharmacies: any[];
  selectedLabId: string | 'all';
  setSelectedLabId: (id: string | 'all') => void;
  selectedPharmacyId: string | 'all';
  setSelectedPharmacyId: (id: string | 'all') => void;
}

export const Filters: React.FC<FiltersProps> = ({
  labs,
  pharmacies,
  selectedLabId,
  setSelectedLabId,
  selectedPharmacyId,
  setSelectedPharmacyId
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
);