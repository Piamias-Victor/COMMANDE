import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden', className)}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};