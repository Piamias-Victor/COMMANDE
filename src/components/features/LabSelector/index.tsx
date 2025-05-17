import React from 'react';
import { Button } from '@/components/ui/Button';
import { useLabSelector } from '@/hooks/useLabSelector';
import { LabDropdown } from './LabDropdown';
import { AddLabForm } from './AddLabForm';

export const LabSelector: React.FC = () => {
  const {
    labs,
    selectedLabId,
    isAddingLab,
    setIsAddingLab,
    newLabName,
    setNewLabName,
    newLabLogoUrl,
    setNewLabLogoUrl,
    handleCreateLab,
    handleCancel,
    handleLabChange
  } = useLabSelector();

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-grow">
          <LabDropdown
            labs={labs}
            selectedLabId={selectedLabId}
            onChange={handleLabChange}
          />
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
          <AddLabForm
            newLabName={newLabName}
            setNewLabName={setNewLabName}
            newLabLogoUrl={newLabLogoUrl}
            setNewLabLogoUrl={setNewLabLogoUrl}
            onCancel={handleCancel}
            onSubmit={handleCreateLab}
          />
        )}
      </div>
    </div>
  );
};