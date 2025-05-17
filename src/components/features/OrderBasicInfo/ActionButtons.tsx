import React from 'react';
import { Button } from '@/components/ui/Button';

interface ActionButtonsProps {
  onDownload: () => void;
  isDownloading: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onDownload, isDownloading }) => (
  <div className="flex items-center space-x-2">
    <Button
      variant="outline"
      onClick={onDownload}
      loading={isDownloading}
      disabled={isDownloading}
    >
      Télécharger CSV
    </Button>
    
    <Button variant="outline">
      Exporter PDF
    </Button>
  </div>
);