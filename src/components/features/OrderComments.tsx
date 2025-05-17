// src/components/features/OrderComments.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// Dans une application réelle, nous aurions un type Comment et une API 
// pour stocker les commentaires. Pour cette démo, nous utiliserons un état local.
interface Comment {
  id: string;
  text: string;
  author: string;
  date: Date;
}

interface OrderCommentsProps {
  orderId: string;
}

export const OrderComments: React.FC<OrderCommentsProps> = ({ orderId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simuler un appel API
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        author: session?.user?.name || 'Utilisateur anonyme',
        date: new Date()
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      setIsSubmitting(false);
      
      toast.success('Commentaire ajouté');
    }, 500);
  };
  
  const handleDeleteComment = (id: string) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
    toast.success('Commentaire supprimé');
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Commentaires</h3>
      
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
            onClick={handleAddComment}
            disabled={!newComment.trim() || isSubmitting}
            loading={isSubmitting}
          >
            Ajouter
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Aucun commentaire pour cette commande
          </p>
        ) : (
          comments.map(comment => (
            <div 
              key={comment.id}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comment.date.toLocaleString('fr-FR')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
              <p className="mt-2 text-sm">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};