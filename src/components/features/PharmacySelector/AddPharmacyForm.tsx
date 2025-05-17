import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AddPharmacyFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  address: string;
  setAddress: (address: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export const AddPharmacyForm: React.FC<AddPharmacyFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  address,
  setAddress,
  onCancel,
  onSubmit
}) => {
  const isValid = name.trim() && email.trim();
  
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium mb-2">Nouvelle pharmacie</h3>
      <Input
        placeholder="Nom de la pharmacie"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-2"
        fullWidth
      />
      <Input
        placeholder="Email de contact"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2"
        fullWidth
      />
      <Input
        placeholder="Adresse (optionnel)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="mb-2"
        fullWidth
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" size="sm" onClick={onSubmit} disabled={!isValid}>
          Créer
        </Button>
      </div>
    </div>
  );
};