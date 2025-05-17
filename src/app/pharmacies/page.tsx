'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { useOrderStore } from '@/store/orderStore';
import toast from 'react-hot-toast';

export default function PharmaciesPage() {
  const { pharmacies, addPharmacy, updatePharmacy, removePharmacy, initialize } = usePharmacyStore();
  const { orders } = useOrderStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  
  const handleSavePharmacy = () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('Nom et email requis');
      return;
    }
    
    if (isEditing) {
      updatePharmacy(isEditing, {
        name: newName.trim(),
        email: newEmail.trim(),
        address: newAddress.trim() || undefined,
        updatedAt: new Date()
      });
      toast.success('Pharmacie mise à jour avec succès');
      setIsEditing(null);
    } else {
      addPharmacy(
        null,  // ID null pour générer un nouvel ID
        newName.trim(), 
        newEmail.trim(), 
        'password',  // Mot de passe par défaut
        newAddress.trim() || undefined
      );
      toast.success('Pharmacie ajoutée avec succès');
      setIsAdding(false);
    }
    
    setNewName('');
    setNewEmail('');
    setNewAddress('');
  };
  
  const handleEdit = (id: string) => {
    const pharmacy = pharmacies.find(p => p.id === id);
    if (pharmacy) {
      setNewName(pharmacy.name);
      setNewEmail(pharmacy.email);
      setNewAddress(pharmacy.address || '');
      setIsEditing(id);
      setIsAdding(false);
    }
  };
  
  const handleDelete = (id: string) => {
    // Vérifier si la pharmacie a des commandes associées
    const pharmacyOrders = orders.filter(order => order.pharmacyId === id);
    
    if (pharmacyOrders.length > 0) {
      toast.error(`Impossible de supprimer: ${pharmacyOrders.length} commande(s) associée(s)`);
      return;
    }
    
    removePharmacy(id);
    toast.success('Pharmacie supprimée avec succès');
    
    if (isEditing === id) {
      setIsEditing(null);
      setNewName('');
      setNewEmail('');
      setNewAddress('');
    }
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setNewName('');
    setNewEmail('');
    setNewAddress('');
  };
  
  const handleInitialize = () => {
    initialize();
    toast.success('Pharmacies par défaut initialisées');
  };
  
  // Calcul des statistiques pour chaque pharmacie
  const pharmacyStats = pharmacies.map(pharmacy => {
    const pharmacyOrders = orders.filter(order => order.pharmacyId === pharmacy.id);
    const labsCount = new Set(pharmacyOrders.map(order => order.labId)).size;
    const referencesCount = pharmacyOrders.reduce((sum, order) => sum + order.referencesCount, 0);
    const boxesCount = pharmacyOrders.reduce((sum, order) => sum + order.boxesCount, 0);
    
    return {
      ...pharmacy,
      ordersCount: pharmacyOrders.length,
      labsCount,
      referencesCount,
      boxesCount
    };
  });

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Gestion des pharmacies</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleInitialize}
                disabled={isAdding || isEditing !== null}
              >
                Réinitialiser les pharmacies
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  setIsAdding(true);
                  setIsEditing(null);
                  setNewName('');
                  setNewEmail('');
                  setNewAddress('');
                }}
                disabled={isAdding || isEditing !== null}
              >
                Ajouter une pharmacie
              </Button>
            </div>
          </div>
          
          {(isAdding || isEditing !== null) && (
            <Card className="mb-6 p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 slide-in">
              <h3 className="text-lg font-medium mb-4">
                {isAdding ? 'Ajouter une pharmacie' : 'Modifier la pharmacie'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Nom de la pharmacie"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nom de la pharmacie"
                  required
                />
                <Input
                  label="Email de contact"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  required
                />
              </div>
              <Input
                label="Adresse (optionnel)"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Adresse complète"
                className="mb-4"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSavePharmacy}
                  disabled={!newName.trim() || !newEmail.trim()}
                >
                  {isAdding ? 'Ajouter' : 'Sauvegarder'}
                </Button>
              </div>
            </Card>
          )}
          
          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Adresse
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Commandes
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Laboratoires
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Références
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Boîtes
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {pharmacyStats.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Aucune pharmacie disponible
                      </td>
                    </tr>
                  ) : (
                    pharmacyStats.map((pharmacy) => (
                      <tr 
                        key={pharmacy.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          isEditing === pharmacy.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {pharmacy.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {pharmacy.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {pharmacy.address || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                          {pharmacy.ordersCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                          {pharmacy.labsCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                          {pharmacy.referencesCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                          {pharmacy.boxesCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(pharmacy.id)}
                              disabled={isAdding || isEditing !== null}
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              onClick={() => handleDelete(pharmacy.id)}
                              disabled={(isAdding || isEditing !== null) || pharmacy.ordersCount > 0}
                              title={pharmacy.ordersCount > 0 ? "Impossible de supprimer : commandes associées" : ""}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
}