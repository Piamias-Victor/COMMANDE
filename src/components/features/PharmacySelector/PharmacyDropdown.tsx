import React from 'react';
import { Select } from '@/components/ui/Select';

interface PharmacyDropdownProps {
  pharmacies: Array<{ id: string; name: string }>;
  selectedPharmacyId: string | null;
  onChange: (value: string) => void;
}

export const PharmacyDropdown: React.FC<PharmacyDropdownProps> = ({
  pharmacies,
  selectedPharmacyId,
  onChange
}) => {
  if (pharmacies.length === 0) {
    return <p className="text-gray-500 mb-2">Aucune pharmacie disponible</p>;
  }
  
  return (
    <Select
      label="Sélectionnez une pharmacie"
      options={[
        { value: '', label: 'Sélectionnez une pharmacie...' },
        ...pharmacies.map((pharmacy) => ({
          value: pharmacy.id,
          label: pharmacy.name,
        })),
      ]}
      value={selectedPharmacyId || ''}
      onChange={onChange}
      fullWidth
    />
  );
};