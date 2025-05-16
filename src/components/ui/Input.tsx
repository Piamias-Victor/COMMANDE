import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
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
      <input
        className={clsx(
          'shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm p-2',
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