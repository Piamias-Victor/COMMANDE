'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useLabStore } from '@/store/labStore';
import { useOrderStore } from '@/store/orderStore';
import { useUIStore } from '@/store/uiStore';
import { useCsvParser } from '@/hooks/useCsvParser';
import { usePharmacyId } from '@/hooks/usePharmacyId';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export const CsvUploader: React.FC = () => {
  const pharmacyId = usePharmacyId(); // Utiliser notre hook personnalisé
  const { selectedLabId } = useLabStore();
  const { addOrder } = useOrderStore();
  const { setLoading } = useUIStore();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Array<{ code: string; quantity: number }>>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState<{ references: number; boxes: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    parseFile,
    parseResult,
    isLoading,
    error,
    clearResult
  } = useCsvParser({
    delimiter: ';',
    skipEmptyLines: true
  });

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!selectedLabId) {
      toast.error('Veuillez sélectionner un laboratoire d\'abord');
      return;
    }

    if (!pharmacyId) {
      toast.error('Vous devez être connecté pour importer un fichier');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFileChange(file);
    }
  }, [selectedLabId, pharmacyId]);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Seuls les fichiers CSV sont acceptés');
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setLoading(true);
    
    try {
      const result = await parseFile(file);
      
      if (result) {
        setPreviewData(result.data.slice(0, 10)); // Prévisualisation des 10 premières lignes
        setErrorMessages(result.errors);
        setStats({
          references: result.uniqueCodes, 
          boxes: result.totalQuantity
        });
      }
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLabId) {
      toast.error('Veuillez sélectionner un laboratoire d\'abord');
      return;
    }
    
    if (!pharmacyId) {
      toast.error('Vous devez être connecté pour importer un fichier');
      return;
    }
    
    if (e.target.files && e.target.files.length > 0) {
      await handleFileChange(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (!selectedLabId) {
      toast.error('Veuillez sélectionner un laboratoire d\'abord');
      return;
    }
    
    if (!pharmacyId) {
      toast.error('Vous devez être connecté pour importer un fichier');
      return;
    }
    
    fileInputRef.current?.click();
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPreviewData([]);
    setErrorMessages([]);
    setStats(null);
    clearResult();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !parseResult || !selectedLabId || !pharmacyId) {
      return;
    }
    
    setIsUploading(true);
    
    setTimeout(() => {
      addOrder(
        selectedLabId,
        pharmacyId,
        selectedFile.name,
        parseResult.rawContent,
        parseResult.data,
        parseResult.uniqueCodes,
        parseResult.totalQuantity
        // Le statut 'pending' est défini par défaut dans la fonction addOrder
      );
      
      toast.success('Fichier CSV importé avec succès');
      handleCancelUpload();
      setIsUploading(false);
    }, 500);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 transition-all duration-300">
      <h3 className="text-lg font-medium mb-4">Importer un fichier CSV</h3>
      
      {!selectedLabId && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-md mb-4 slide-in">
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            Veuillez sélectionner un laboratoire avant d importer un fichier CSV.
          </p>
        </div>
      )}
      
      {selectedFile ? (
        <div className="mb-4 slide-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {stats ? (
                  <>
                    <span className="font-medium">{stats.references}</span> références • 
                    <span className="font-medium"> {stats.boxes}</span> boîtes • 
                    <span> {(selectedFile.size / 1024).toFixed(2)} KB</span>
                  </>
                ) : (
                  <>{(selectedFile.size / 1024).toFixed(2)} KB</>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelUpload} disabled={isUploading}>
                Annuler
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSubmit}
                disabled={isLoading || isUploading || !parseResult || parseResult.data.length === 0}
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
                {parseResult && parseResult.data.length > 10 && (
                  <div className="text-gray-500 mt-2 text-center">
                    ...{parseResult.data.length - 10} lignes supplémentaires
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md ${
            dragActive ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
          } transition-colors p-8 text-center`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <svg
              className={`w-10 h-10 text-gray-400 ${dragActive ? 'scale-110' : ''} transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {dragActive 
                  ? 'Déposez votre fichier ici...' 
                  : 'Glissez-déposez votre fichier CSV ici, ou'}
              </p>
              <Button 
                variant="primary" 
                onClick={handleButtonClick}
                disabled={!selectedLabId}
                className="transition-transform hover:scale-105"
              >
                Sélectionner un fichier
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500">
              Format accepté : CSV avec  code;quantité (les articles avec quantité 0 seront ignorés)
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md fade-in">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
    </Card>
  );
};