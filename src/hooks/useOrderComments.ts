import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

// Type pour un commentaire
interface Comment {
  id: string;
  text: string;
  author: string;
  date: Date;
}

export function useOrderComments(orderId: string) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Ajouter un commentaire
  const handleAddComment = useCallback(() => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simuler un appel API avec un délai
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
  }, [newComment, session?.user?.name]);
  
  // Supprimer un commentaire
  const handleDeleteComment = useCallback((id: string) => {
    setComments(prev => prev.filter(comment => comment.id !== id));
    toast.success('Commentaire supprimé');
  }, []);
  
  return {
    comments,
    newComment,
    setNewComment,
    isSubmitting,
    handleAddComment,
    handleDeleteComment
  };
}