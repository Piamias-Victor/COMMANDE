import React, { useState } from 'react';
import { useLabStore } from '@/store/labStore';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const LabSelector: React.FC = () => {
  const { labs, selectedLabId, selectLab, addLab } = useLabStore();
  const [isAddingLab, setIsAddingLab] = useState(false);
  const [newLabName, setNewLabName] = useState('');
  const [newLabLogoUrl, setNewLabLogoUrl] = useState('');

  const handleCreateLab = () => {
    if (newLabName.trim()) {
      addLab(newLabName.trim(), newLabLogoUrl.trim() || undefined);
      setNewLabName('');
      setNewLabLogoUrl('');
      setIsAddingLab(false);
    }
  };

  const handleCancel = () => {
    setNewLabName('');
    setNewLabLogoUrl('');
    setIsAddingLab(false);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-grow">
          {labs.length > 0 ? (
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
              onChange={(value) => selectLab(value || null)}
              fullWidth
            />
          ) : (
            <p className="text-gray-500 mb-2">Aucun laboratoire disponible</p>
          )}
        </div>
        
        {!isAddingLab ? (
          <Button 
            variant="outline" 
            onClick={() => setIsAddingLab(true)}
            className="whitespace-nowrap"
          >
            Ajouter un laboratoire
          </Button>
        ) : (
          <div className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-2">Nouveau laboratoire</h3>
            <Input
              placeholder="Nom du laboratoire"
              value={newLabName}
              onChange={(e) => setNewLabName(e.target.value)}
              className="mb-2"
              fullWidth
            />
            <Input
              placeholder="URL du logo (optionnel)"
              value={newLabLogoUrl}
              onChange={(e) => setNewLabLogoUrl(e.target.value)}
              className="mb-2"
              fullWidth
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Annuler
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleCreateLab}
                disabled={!newLabName.trim()}
              >
                Créer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};