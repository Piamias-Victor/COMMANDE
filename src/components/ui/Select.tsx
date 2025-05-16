import React from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  fullWidth = false,
  onChange,
  className,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={clsx('mb-4', { 'w-full': fullWidth })}>
      {label && (
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'shadow-sm rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm p-2',
          {
            'border-red-300 focus:ring-red-500 focus:border-red-500': error,
          },
          className
        )}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};