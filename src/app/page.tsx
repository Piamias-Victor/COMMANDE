'use client';

import { MainLayout } from '@/components/layouts/MainLayout';
import { LabSelector } from '@/components/features/LabSelector';
import { CsvUploader } from '@/components/features/CsvUploader';
import { StatsSummary } from '@/components/features/StatsSummary';
import { OrderStatusSummary } from '@/components/features/OrderStatusSummary';
import { Card } from '@/components/ui/Card';
import { useEffect } from 'react';
import { usePharmacyStore } from '@/store/pharmacyStore';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { initialize } = usePharmacyStore();
  const { data: session } = useSession();

  // Initialiser les 5 pharmacies par défaut au chargement de la page
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>
          
          <StatsSummary />
          
          <OrderStatusSummary />
        </section>
        
        <section className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Gestion des commandes</h2>
          <Card className="mb-6 bg-white dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Bienvenue {session?.user?.name || ''} dans PharmCSV Manager, votre outil de gestion des commandes
              pharmaceutiques par laboratoire.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Commencez par sélectionner un laboratoire, puis importez vos fichiers CSV
              pour gérer vos commandes.
            </p>
          </Card>
          
          <LabSelector />
          
          <CsvUploader />
        </section>
      </div>
    </MainLayout>
  );
}