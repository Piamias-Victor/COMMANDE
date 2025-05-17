import { useState, useCallback, useEffect } from 'react';
import { usePharmacyStore } from '@/store/pharmacyStore';

export function usePharmacySelector() {
  const { pharmacies, selectedPharmacyId, selectPharmacy, addPharmacy, initialize } = usePharmacyStore();
  const [isAddingPharmacy, setIsAddingPharmacy] = useState(false);
  const [newPharmacyName, setNewPharmacyName] = useState('');
  const [newPharmacyEmail, setNewPharmacyEmail] = useState('');
  const [newPharmacyAddress, setNewPharmacyAddress] = useState('');

  // Initialiser les pharmacies par défaut au chargement
  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleCreatePharmacy = useCallback(() => {
    if (newPharmacyName.trim() && newPharmacyEmail.trim()) {
      addPharmacy(
        null,  // ID null pour générer un nouvel ID
        newPharmacyName.trim(), 
        newPharmacyEmail.trim(), 
        'password',  // Mot de passe par défaut
        newPharmacyAddress.trim() || undefined
      );
      resetForm();
    }
  }, [newPharmacyName, newPharmacyEmail, newPharmacyAddress, addPharmacy]);

  const resetForm = useCallback(() => {
    setNewPharmacyName('');
    setNewPharmacyEmail('');
    setNewPharmacyAddress('');
    setIsAddingPharmacy(false);
  }, []);

  const handleCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handlePharmacyChange = useCallback((value: string) => {
    selectPharmacy(value || null);
  }, [selectPharmacy]);

  return {
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
  };
}