import { useState, useCallback } from 'react';
import { useLabStore } from '@/store/labStore';

export function useLabSelector() {
  const { labs, selectedLabId, selectLab, addLab } = useLabStore();
  const [isAddingLab, setIsAddingLab] = useState(false);
  const [newLabName, setNewLabName] = useState('');
  const [newLabLogoUrl, setNewLabLogoUrl] = useState('');

  const handleCreateLab = useCallback(() => {
    if (newLabName.trim()) {
      addLab(newLabName.trim(), newLabLogoUrl.trim() || undefined);
      resetForm();
    }
  }, [newLabName, newLabLogoUrl, addLab]);

  const resetForm = useCallback(() => {
    setNewLabName('');
    setNewLabLogoUrl('');
    setIsAddingLab(false);
  }, []);

  const handleCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleLabChange = useCallback((value: string) => {
    selectLab(value || null);
  }, [selectLab]);

  return {
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
  };
}