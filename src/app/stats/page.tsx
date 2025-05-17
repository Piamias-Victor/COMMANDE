'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { LabStatistics } from '@/components/features/LabStatistics';
import { useLabStore } from '@/store/labStore';
import { Select } from '@/components/ui/Select';

export default function StatsPage() {
  const { labs } = useLabStore();
  const [filterLabId, setFilterLabId] = useState<string | undefined>(undefined);
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-2xl font-bold">Statistiques</h2>
            
            <Select
              options={[
                { value: '', label: 'Tous les laboratoires' },
                ...labs.map((lab) => ({
                  value: lab.id,
                  label: lab.name,
                })),
              ]}
              value={filterLabId || ''}
              onChange={(value) => setFilterLabId(value || undefined)}
            />
          </div>
          
          <LabStatistics labId={filterLabId} />
        </section>
      </div>
    </MainLayout>
  );
}