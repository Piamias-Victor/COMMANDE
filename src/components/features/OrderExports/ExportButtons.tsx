import React from 'react';
import { Button } from '@/components/ui/Button';

interface ExportButtonsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  onShare: () => void;
  isExporting: string | null;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  onExportCSV,
  onExportPDF,
  onExportExcel,
  onShare,
  isExporting
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
    <Button
      variant="outline"
      onClick={onExportCSV}
      loading={isExporting === 'csv'}
      disabled={isExporting !== null}
    >
      <span className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        Export CSV
      </span>
    </Button>
    
    <Button
      variant="outline"
      onClick={onExportPDF}
      loading={isExporting === 'pdf'}
      disabled={isExporting !== null}
    >
      <span className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export PDF
      </span>
    </Button>
    
    <Button
      variant="outline"
      onClick={onExportExcel}
      loading={isExporting === 'excel'}
      disabled={isExporting !== null}
    >
      <span className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Excel
      </span>
    </Button>
    
    <Button
      variant="outline"
      onClick={onShare}
      loading={isExporting === 'share'}
      disabled={isExporting !== null}
    >
      <span className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Partager
      </span>
    </Button>
  </div>
);