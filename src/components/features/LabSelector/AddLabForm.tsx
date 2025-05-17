import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AddLabFormProps {
  newLabName: string;
  setNewLabName: (name: string) => void;
  newLabLogoUrl: string;
  setNewLabLogoUrl: (url: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export const AddLabForm: React.FC<AddLabFormProps> = ({
  newLabName,
  setNewLabName,
  newLabLogoUrl,
  setNewLabLogoUrl,
  onCancel,
  onSubmit
}) => (
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
      <Button variant="outline" size="sm" onClick={onCancel}>
        Annuler
      </Button>
      <Button 
        variant="primary" 
        size="sm" 
        onClick={onSubmit}
        disabled={!newLabName.trim()}
      >
        Créer
      </Button>
    </div>
  </div>
);