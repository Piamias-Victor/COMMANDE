import React from 'react';
import { Select } from '@/components/ui/Select';

interface LabDropdownProps {
  labs: Array<{ id: string; name: string }>;
  selectedLabId: string | null;
  onChange: (value: string) => void;
}

export const LabDropdown: React.FC<LabDropdownProps> = ({
  labs,
  selectedLabId,
  onChange
}) => {
  if (labs.length === 0) {
    return <p className="text-gray-500 mb-2">Aucun laboratoire disponible</p>;
  }
  
  return (
    <Select
      label="Sélectionnez un laboratoire"
      options={[
        { value: '', label: 'Sélectionnez un laboratoire...' },
        ...labs.map((lab) => ({
          value: lab.id,
          label: lab.name,
        })),
      ]}
      value={selectedLabId || ''}
      onChange={onChange}
      fullWidth
    />
  );
};