import React from 'react';
import { Button } from '@/components/ui/Button';

interface FilePreviewProps {
  fileName: string;
  fileSize: number;
  stats: { references: number; boxes: number } | null;
  previewData: Array<{ code: string; quantity: number }>;
  errorMessages: string[];
  isUploading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  parseData: { data: Array<{ code: string; quantity: number }> } | null;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  fileName,
  fileSize,
  stats,
  previewData,
  errorMessages,
  isUploading,
  onCancel,
  onSubmit,
  parseData
}) => (
  <div className="mb-4 slide-in">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="font-medium">{fileName}</p>
        <p className="text-sm text-gray-500">
          {stats ? (
            <>
              <span className="font-medium">{stats.references}</span> références • 
              <span className="font-medium"> {stats.boxes}</span> boîtes • 
              <span> {(fileSize / 1024).toFixed(2)} KB</span>
            </>
          ) : (
            <>{(fileSize / 1024).toFixed(2)} KB</>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={isUploading}>
          Annuler
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onSubmit}
          disabled={isUploading || !parseData || parseData.data.length === 0}
          loading={isUploading}
        >
          Importer
        </Button>
      </div>
    </div>
    
    {errorMessages.length > 0 && (
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md fade-in">
        <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
          Avertissements ({errorMessages.length}) :
        </p>
        <ul className="text-sm text-red-700 dark:text-red-300 list-disc pl-5">
          {errorMessages.slice(0, 5).map((err, index) => (
            <li key={index}>{err}</li>
          ))}
          {errorMessages.length > 5 && (
            <li>...et {errorMessages.length - 5} autres</li>
          )}
        </ul>
      </div>
    )}
    
    {previewData.length > 0 && (
      <div className="mb-4 fade-in">
        <p className="text-sm font-medium mb-2">Aperçu :</p>
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-2">Code EAN13</th>
                <th className="text-right py-2 px-2">Quantité</th>
              </tr>
            </thead>
            <tbody>
              {previewData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-1 px-2">{item.code}</td>
                  <td className="py-1 px-2 text-right">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {parseData && parseData.data.length > 10 && (
            <div className="text-gray-500 mt-2 text-center">
              ...{parseData.data.length - 10} lignes supplémentaires
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);