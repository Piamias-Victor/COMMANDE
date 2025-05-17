import React from 'react';
import { Button } from '@/components/ui/Button';

interface DropZoneProps {
  dragActive: boolean;
  selectedLabId: string | null;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onButtonClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  dragActive,
  selectedLabId,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onButtonClick,
  fileInputRef,
  onFileChange
}) => (
  <div
    className={`border-2 border-dashed rounded-md ${
      dragActive ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
    } transition-colors p-8 text-center`}
    onDragEnter={onDragEnter}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
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
          onClick={onButtonClick}
          disabled={!selectedLabId}
          className="transition-transform hover:scale-105"
        >
          Sélectionner un fichier
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-500">
        Format accepté : CSV avec code;quantité (les articles avec quantité 0 seront ignorés)
      </p>
    </div>
  </div>
);