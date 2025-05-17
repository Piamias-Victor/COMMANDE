import React from 'react';
import { Button } from '@/components/ui/Button';

interface CommentItemProps {
  id: string;
  author: string;
  date: Date;
  text: string;
  onDelete: (id: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  id,
  author,
  date,
  text,
  onDelete
}) => (
  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium">{author}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {date.toLocaleString('fr-FR')}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(id)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </Button>
    </div>
    <p className="mt-2 text-sm">{text}</p>
  </div>
);