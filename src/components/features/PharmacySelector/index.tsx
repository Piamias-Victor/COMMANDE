import React from 'react';
import { Button } from '@/components/ui/Button';
import { usePharmacySelector } from '@/hooks/usePharmacySelector';
import { PharmacyDropdown } from './PharmacyDropdown';
import { AddPharmacyForm } from './AddPharmacyForm';

export const PharmacySelector: React.FC = () => {
  const {
    pharmacies,
    selectedPharmacyId,
    isAddingPharmacy,
    setIsAddingPharmacy,
    newPharmacyName,
    setNewPharmacyName,
    newPharmacyEmail,
    setNewPharmacyEmail,
    newPharmacyAddress,
    setNewPharmacyAddress,
    handleCreatePharmacy,
    handleCancel,
    handlePharmacyChange
  } = usePharmacySelector();

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-grow">
          <PharmacyDropdown
            pharmacies={pharmacies}
            selectedPharmacyId={selectedPharmacyId}
            onChange={handlePharmacyChange}
          />
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
          <AddPharmacyForm
            name={newPharmacyName}
            setName={setNewPharmacyName}
            email={newPharmacyEmail}
            setEmail={setNewPharmacyEmail}
            address={newPharmacyAddress}
            setAddress={setNewPharmacyAddress}
            onCancel={handleCancel}
            onSubmit={handleCreatePharmacy}
          />
        )}
      </div>
    </div>
  );
};