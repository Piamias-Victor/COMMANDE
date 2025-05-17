import React from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

interface NoteFormProps {
  isNoteExpanded: boolean;
  setIsNoteExpanded: (expanded: boolean) => void;
  reviewNote: string;
  setReviewNote: (note: string) => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({
  isNoteExpanded,
  setIsNoteExpanded,
  reviewNote,
  setReviewNote
}) => (
  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-2 mb-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsNoteExpanded(!isNoteExpanded)}
      >
        {isNoteExpanded ? 'Masquer la note' : 'Ajouter une note'}
      </Button>
    </div>
    
    {isNoteExpanded && (
      <div className="mt-2">
        <Textarea
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          placeholder="Ajouter un commentaire sur cette commande..."
          rows={3}
          className="mb-2"
        />
      </div>
    )}
  </div>
);