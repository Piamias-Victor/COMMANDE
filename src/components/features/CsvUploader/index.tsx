import React from 'react';
import { usePharmacyId } from '@/hooks/usePharmacyId';
import { Card } from '@/components/ui/Card';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { DropZone } from './DropZone';
import { FilePreview } from './FilePreview';

export const CsvUploader: React.FC = () => {
  const pharmacyId = usePharmacyId();
  const {
    selectedLabId,
    dragActive,
    selectedFile,
    previewData,
    errorMessages,
    isUploading,
    isLoading,
    stats,
    error,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileSelect,
    handleButtonClick,
    handleCancelUpload,
    handleSubmit,
    parseResult
  } = useCsvUpload(pharmacyId);

  return (
    <Card className="bg-white dark:bg-gray-800 transition-all duration-300">
      <h3 className="text-lg font-medium mb-4">Importer un fichier CSV</h3>
      
      {!selectedLabId && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md mb-4 slide-in">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Veuillez sélectionner un laboratoire avant d'importer un fichier CSV.
          </p>
        </div>
      )}
      
      {selectedFile ? (
        <FilePreview 
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          stats={stats}
          previewData={previewData}
          errorMessages={errorMessages}
          isUploading={isUploading || isLoading}
          onCancel={handleCancelUpload}
          onSubmit={handleSubmit}
          parseData={parseResult}
        />
      ) : (
        <DropZone 
          dragActive={dragActive}
          selectedLabId={selectedLabId}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onButtonClick={handleButtonClick}
          fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
          onFileChange={handleFileSelect}
        />
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md fade-in">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </Card>
  );
};