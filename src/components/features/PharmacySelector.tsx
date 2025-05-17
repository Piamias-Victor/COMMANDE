import React, { useState, useEffect } from 'react';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const PharmacySelector: React.FC = () => {
  const { pharmacies, selectedPharmacyId, selectPharmacy, addPharmacy, initialize } = usePharmacyStore();
  const [isAddingPharmacy, setIsAddingPharmacy] = useState(false);
  const [newPharmacyName, setNewPharmacyName] = useState('');
  const [newPharmacyEmail, setNewPharmacyEmail] = useState('');
  const [newPharmacyAddress, setNewPharmacyAddress] = useState('');

  // Initialiser les 5 pharmacies par défaut au chargement du composant
  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleCreatePharmacy = () => {
    if (newPharmacyName.trim() && newPharmacyEmail.trim()) {
      addPharmacy(
        null,  // ID null pour générer un nouvel ID
        newPharmacyName.trim(), 
        newPharmacyEmail.trim(), 
        'password',  // Mot de passe par défaut
        newPharmacyAddress.trim() || undefined
      );
      setNewPharmacyName('');
      setNewPharmacyEmail('');
      setNewPharmacyAddress('');
      setIsAddingPharmacy(false);
    }
  };

  const handleCancel = () => {
    setNewPharmacyName('');
    setNewPharmacyEmail('');
    setNewPharmacyAddress('');
    setIsAddingPharmacy(false);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-grow">
          {pharmacies.length > 0 ? (
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
              onChange={(value) => selectPharmacy(value || null)}
              fullWidth
            />
          ) : (
            <p className="text-gray-500 mb-2">Aucune pharmacie disponible</p>
          )}
        </div>
        
        {!isAddingPharmacy ? (
          <Button 
            variant="outline" 
            onClick={() => setIsAddingPharmacy(true)}
            className="whitespace-nowrap"
          >
            Ajouter une pharmacie
          </Button>
        ) : (
          <div className="w-full bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-2">Nouvelle pharmacie</h3>
            <Input
              placeholder="Nom de la pharmacie"
              value={newPharmacyName}
              onChange={(e) => setNewPharmacyName(e.target.value)}
              className="mb-2"
              fullWidth
            />
            <Input
              placeholder="Email de contact"
              type="email"
              value={newPharmacyEmail}
              onChange={(e) => setNewPharmacyEmail(e.target.value)}
              className="mb-2"
              fullWidth
            />
            <Input
              placeholder="Adresse (optionnel)"
              value={newPharmacyAddress}
              onChange={(e) => setNewPharmacyAddress(e.target.value)}
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
                onClick={handleCreatePharmacy}
                disabled={!newPharmacyName.trim() || !newPharmacyEmail.trim()}
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