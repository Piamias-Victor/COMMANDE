import { useState, useRef, useCallback } from 'react';
import { useLabStore } from '@/store/labStore';
import { useOrderStore } from '@/store/orderStore';
import { useUIStore } from '@/store/uiStore';
import { useCsvParser } from '@/hooks/useCsvParser';
import toast from 'react-hot-toast';

interface CsvUploadStats {
  references: number;
  boxes: number;
}

export function useCsvUpload(pharmacyId: string | null) {
  const { selectedLabId } = useLabStore();
  const { addOrder } = useOrderStore();
  const { setLoading } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Array<{ code: string; quantity: number }>>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [stats, setStats] = useState<CsvUploadStats | null>(null);
  
  const {
    parseFile,
    parseResult,
    isLoading,
    error,
    clearResult
  } = useCsvParser({ delimiter: ';', skipEmptyLines: true });

  const validatePrerequisites = useCallback((): boolean => {
    if (!selectedLabId) {
      toast.error('Veuillez sélectionner un laboratoire d\'abord');
      return false;
    }

    if (!pharmacyId) {
      toast.error('Vous devez être connecté pour importer un fichier');
      return false;
    }
    
    return true;
  }, [selectedLabId, pharmacyId]);

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
    
    if (!validatePrerequisites()) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileChange(e.dataTransfer.files[0]);
    }
  }, [validatePrerequisites]);

  const handleFileChange = useCallback(async (file: File) => {
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
        setPreviewData(result.data.slice(0, 10));
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
  }, [parseFile, setLoading]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!validatePrerequisites()) return;
    
    if (e.target.files && e.target.files.length > 0) {
      await handleFileChange(e.target.files[0]);
    }
  }, [validatePrerequisites, handleFileChange]);

  const handleButtonClick = useCallback(() => {
    if (!validatePrerequisites()) return;
    fileInputRef.current?.click();
  }, [validatePrerequisites]);

  const handleCancelUpload = useCallback(() => {
    setSelectedFile(null);
    setPreviewData([]);
    setErrorMessages([]);
    setStats(null);
    clearResult();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [clearResult]);

  const handleSubmit = useCallback(() => {
    if (!selectedFile || !parseResult || !selectedLabId || !pharmacyId) {
      return;
    }
    
    setIsUploading(true);
    
    setTimeout(() => {
      try {
        addOrder(
          selectedLabId,
          pharmacyId,
          selectedFile.name,
          parseResult.rawContent,
          parseResult.data,
          parseResult.uniqueCodes,
          parseResult.totalQuantity
        );
        
        toast.success('Fichier CSV importé avec succès');
        handleCancelUpload();
      } catch (error) {
        toast.error('Erreur lors de l\'import du fichier');
      } finally {
        setIsUploading(false);
      }
    }, 500);
  }, [selectedFile, parseResult, selectedLabId, pharmacyId, addOrder, handleCancelUpload]);

  return {
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
  };
}