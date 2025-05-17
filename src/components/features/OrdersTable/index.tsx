import React from 'react';
import { Card } from '@/components/ui/Card';
import { useOrdersTable } from '@/hooks/useOrdersTable';
import { Filters } from './Filters';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { EmptyState } from './EmptyState';

export const OrdersTable: React.FC = () => {
  const {
    labs,
    pharmacies,
    orders,
    sortField,
    sortDirection,
    selectedLabId,
    setSelectedLabId,
    selectedPharmacyId,
    setSelectedPharmacyId,
    isDownloading,
    isDeleting,
    labsMap,
    getPharmacyName,
    filteredOrders,
    sortedOrders,
    totals,
    handleSort,
    handleDownload,
    handleDelete
  } = useOrdersTable();

  if (orders.length === 0) {
    return <EmptyState type="no-orders" />;
  }

  if (filteredOrders.length === 0) {
    return (
      <Card>
        <div className="mb-4">
          <Filters
            labs={labs}
            pharmacies={pharmacies}
            selectedLabId={selectedLabId}
            setSelectedLabId={setSelectedLabId}
            selectedPharmacyId={selectedPharmacyId}
            setSelectedPharmacyId={setSelectedPharmacyId}
          />
        </div>
        <EmptyState type="no-filtered-orders" />
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4">
        <Filters
          labs={labs}
          pharmacies={pharmacies}
          selectedLabId={selectedLabId}
          setSelectedLabId={setSelectedLabId}
          selectedPharmacyId={selectedPharmacyId}
          setSelectedPharmacyId={setSelectedPharmacyId}
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            handleSort={handleSort}
          />
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {sortedOrders.map((order) => (
              <TableRow 
                key={order.id}
                order={order}
                labName={labsMap[order.labId] || 'Inconnu'}
                pharmacyName={getPharmacyName(order.pharmacyId)}
                isDownloading={isDownloading === order.id}
                isDeleting={isDeleting === order.id}
                onDownload={() => handleDownload(order)}
                onDelete={() => handleDelete(order.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 px-6 py-2 bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 rounded-b-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>Total: {totals.orderCount} commande(s)</div>
          <div className="mt-2 sm:mt-0">
            <span className="mr-4">
              <span className="font-medium">{totals.references}</span> références
            </span>
            <span>
              <span className="font-medium">{totals.boxes}</span> boîtes
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};