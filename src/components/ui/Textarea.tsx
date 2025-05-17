// src/components/ui/Textarea.tsx
import React from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <div className={clsx('mb-4', { 'w-full': fullWidth })}>
      {label && (
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm p-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white',
          {
            'border-red-300 focus:ring-red-500 focus:border-red-500': error,
          },
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};