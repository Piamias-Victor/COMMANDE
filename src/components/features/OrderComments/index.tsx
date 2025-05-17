import React from 'react';
import { Card } from '@/components/ui/Card';
import { useOrderComments } from '@/hooks/useOrderComments';
import { CommentForm } from './CommentForm';
import { CommentsList } from './CommentsList';

interface OrderCommentsProps {
  orderId: string;
}

export const OrderComments: React.FC<OrderCommentsProps> = ({ orderId }) => {
  const {
    comments,
    newComment,
    setNewComment,
    isSubmitting,
    handleAddComment,
    handleDeleteComment
  } = useOrderComments(orderId);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Commentaires</h3>
      
      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        isSubmitting={isSubmitting}
        onSubmit={handleAddComment}
      />
      
      <CommentsList
        comments={comments}
        onDelete={handleDeleteComment}
      />
    </Card>
  );
};