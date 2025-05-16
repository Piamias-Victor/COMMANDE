'use client';

import { MainLayout } from '@/components/layouts/MainLayout';
import { OrdersTable } from '@/components/features/OrdersTable';

export default function OrdersPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Historique des commandes</h2>
          
          <OrdersTable />
        </section>
      </div>
    </MainLayout>
  );
}