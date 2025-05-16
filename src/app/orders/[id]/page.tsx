'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layouts/MainLayout';
import { useOrderStore } from '@/store/orderStore';
import { useLabStore } from '@/store/labStore'; 
import { usePharmacyStore } from '@/store/pharmacyStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderWorkflow } from '@/components/features/OrderWorkflow';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const { orders } = useOrderStore();
  const { labs } = useLabStore();
  const { pharmacies } = usePharmacyStore();
  
  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);
  
  const lab = useMemo(() => {
    if (!order) return null;
    return labs.find(l => l.id === order.labId);
  }, [labs, order]);
  
  const pharmacy = useMemo(() => {
    if (!order) return null;
    return pharmacies.find(p => p.id === order.pharmacyId);
  }, [pharmacies, order]);
  
  if (!order) {
    return (
      <MainLayout>
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Commande introuvable
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  La commande que vous recherchez n'existe pas ou a été supprimée.
                </p>
              </div>
              <div className="mt-5">
                <Button onClick={() => router.push('/orders')}>
                  Retour aux commandes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Détail de la commande</h1>
          <Button variant="outline" onClick={() => router.push('/orders')}>
            Retour à la liste
          </Button>
        </div>
        
        <Card className="bg-white dark:bg-gray-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Informations générales</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Fichier</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{order.fileName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date de création</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm', { locale: fr })}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Laboratoire</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{lab?.name || 'Inconnu'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pharmacie</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{pharmacy?.name || 'Inconnue'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Références</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{order.referencesCount}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Boîtes</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{order.boxesCount}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-4">Contenu de la commande</h2>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md max-h-60 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Code EAN13
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantité
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {order.parsedData.slice(0, 20).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                          {item.code}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-right text-gray-500 dark:text-gray-400">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                    {order.parsedData.length > 20 && (
                      <tr>
                        <td colSpan={2} className="px-3 py-2 text-center text-xs text-gray-500 dark:text-gray-400">
                          ... et {order.parsedData.length - 20} autres références
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
        
        <OrderWorkflow order={order} onUpdate={() => router.refresh()} />
      </div>
    </MainLayout>
  );
}