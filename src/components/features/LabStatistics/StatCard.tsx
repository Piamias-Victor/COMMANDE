import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  maxValue, 
  color 
}) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-medium">{label}:</span>
        <span className="text-gray-600 dark:text-gray-400">{value}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className={`bg-${color}-500 h-2 rounded-full`}
          style={{ width: `${percentage}%`, transition: 'width 1s ease-in-out' }}
        ></div>
      </div>
    </div>
  );
};