import { useState, useCallback } from 'react';
import Papa from 'papaparse';

interface UseCsvParserOptions {
  delimiter?: string;
  skipEmptyLines?: boolean;
}

interface ParsedItem {
  code: string;
  quantity: number;
}

interface CsvParseResult {
  data: ParsedItem[];
  errors: string[];
  rawContent: string;
  uniqueCodes: number; // Nombre de références uniques
  totalQuantity: number; // Nombre total de boîtes
}

export const useCsvParser = (options: UseCsvParserOptions = {}) => {
  const { 
    delimiter = ';', 
    skipEmptyLines = true,
  } = options;
  
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(
    async (file: File): Promise<CsvParseResult | null> => {
      setIsLoading(true);
      setError(null);
      
      return new Promise((resolve) => {
        Papa.parse(file, {
          delimiter,
          skipEmptyLines,
          complete: (result) => {
            try {
              const rawContent = result.data.map(row => 
                Array.isArray(row) ? row.join(delimiter) : String(row)
              ).join('\n');
              
              // Traiter les données en tenant compte du format à deux colonnes
              const parsedItems: ParsedItem[] = [];
              const errors: string[] = [];
              
              result.data.forEach((row, index) => {
                if (Array.isArray(row) && row.length >= 2) {
                  const code = String(row[0]).trim();
                  const quantityStr = String(row[1]).trim();
                  const quantity = parseInt(quantityStr, 10);
                  
                  // Valider le code EAN13
                  if (!/^\d{13}$/.test(code)) {
                    errors.push(`Ligne ${index + 1}: Code EAN13 invalide (${code})`);
                  }
                  
                  // Valider la quantité
                  if (isNaN(quantity)) {
                    errors.push(`Ligne ${index + 1}: Quantité invalide (${quantityStr})`);
                  } else if (quantity > 0) {
                    // N'ajouter que les entrées avec quantité > 0
                    parsedItems.push({ code, quantity });
                  }
                } else if (row.length === 1) {
                  // Si une seule colonne, essayer de l'interpréter comme un code EAN13
                  const code = String(row[0]).trim();
                  if (/^\d{13}$/.test(code)) {
                    parsedItems.push({ code, quantity: 1 }); // Assigner une quantité par défaut de 1
                  } else {
                    errors.push(`Ligne ${index + 1}: Format invalide, une seule colonne trouvée`);
                  }
                } else if (row.length > 0) {
                  errors.push(`Ligne ${index + 1}: Format invalide, attendu "code;quantité"`);
                }
              });
              
              // Calculer les statistiques
              const uniqueCodes = new Set(parsedItems.map(item => item.code)).size;
              const totalQuantity = parsedItems.reduce((sum, item) => sum + item.quantity, 0);
              
              const parseResult = {
                data: parsedItems,
                errors,
                rawContent,
                uniqueCodes,
                totalQuantity
              };
              
              setParseResult(parseResult);
              setIsLoading(false);
              resolve(parseResult);
            } catch (err) {
              const errorMessage = err instanceof Error 
                ? err.message 
                : 'Erreur lors de l\'analyse du fichier CSV';
              
              setError(errorMessage);
              setIsLoading(false);
              resolve(null);
            }
          },
          error: (error) => {
            setError(`Erreur de parsing: ${error.message}`);
            setIsLoading(false);
            resolve(null);
          }
        });
      });
    },
    [delimiter, skipEmptyLines]
  );

  const validateEan13 = useCallback((code: string): boolean => {
    // Format EAN-13: 13 chiffres
    return /^\d{13}$/.test(code);
  }, []);

  const clearResult = useCallback(() => {
    setParseResult(null);
    setError(null);
  }, []);

  return {
    parseFile,
    validateEan13,
    parseResult,
    isLoading,
    error,
    clearResult
  };
};