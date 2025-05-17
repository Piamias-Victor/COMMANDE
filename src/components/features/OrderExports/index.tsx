import React from 'react';
import { Card } from '@/components/ui/Card';
import { Order, Lab, Pharmacy } from '@/types';
import { useOrderExports } from '@/hooks/useOrderExports';
import { ExportButtons } from './ExportButtons';
import { ExportInfo } from './ExportInfo';

interface OrderExportsProps {
  order: Order;
  lab: Lab | null;
  pharmacy: Pharmacy | null;
}

export const OrderExports: React.FC<OrderExportsProps> = ({ order, lab, pharmacy }) => {
  const {
    isExporting,
    handleExportCSV,
    handleExportPDF,
    handleExportExcel,
    handleShare
  } = useOrderExports(order, lab, pharmacy);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Exporter et partager</h3>
      
      <ExportButtons
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        onShare={handleShare}
        isExporting={isExporting}
      />
      
      <ExportInfo order={order} lab={lab} pharmacy={pharmacy} />
    </Card>
  );
};