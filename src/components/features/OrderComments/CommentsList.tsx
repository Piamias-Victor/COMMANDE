import React from 'react';
import { CommentItem } from './CommentItem';
import { EmptyState } from './EmptyState';

interface Comment {
  id: string;
  text: string;
  author: string;
  date: Date;
}

interface CommentsListProps {
  comments: Comment[];
  onDelete: (id: string) => void;
}

export const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  onDelete
}) => {
  if (comments.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          author={comment.author}
          date={comment.date}
          text={comment.text}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};