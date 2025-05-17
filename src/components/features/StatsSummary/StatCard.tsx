import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  secondaryValue?: string;
  color: string;
  animationDelay?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  secondaryValue, 
  color, 
  animationDelay 
}) => {
  // Définir les classes de couleur en fonction de la couleur fournie
  const bgColorClass = `bg-${color}-50 dark:bg-${color}-900/20`;
  const textColorClass = `text-${color}-700 dark:text-${color}-300`;
  const darkTextColorClass = `text-${color}-800 dark:text-${color}-200`;
  
  return (
    <div 
      className={`p-4 ${bgColorClass} rounded-lg fade-in`} 
      style={{ animationDelay }}
    >
      <p className={`text-sm ${textColorClass} mb-1`}>{title}</p>
      <p className={`text-2xl font-semibold ${darkTextColorClass}`}>
        {value}
        {secondaryValue && (
          <span className="text-sm font-normal"> {secondaryValue}</span>
        )}
      </p>
    </div>
  );
};