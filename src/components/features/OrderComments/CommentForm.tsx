import React from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

interface CommentFormProps {
  newComment: string;
  setNewComment: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  newComment,
  setNewComment,
  isSubmitting,
  onSubmit
}) => (
  <div className="mb-4">
    <Textarea
      label="Ajouter un commentaire"
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="Votre commentaire..."
      rows={3}
      fullWidth
    />
    <div className="flex justify-end">
      <Button
        variant="primary"
        onClick={onSubmit}
        disabled={!newComment.trim() || isSubmitting}
        loading={isSubmitting}
      >
        Ajouter
      </Button>
    </div>
  </div>
);