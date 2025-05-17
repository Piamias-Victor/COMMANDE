import React from 'react';

interface TimelineStepProps {
  isActive: boolean;
  title: string;
  date: string;
  icon: string;
  color: string;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  isActive,
  title,
  date,
  icon,
  color
}) => (
  <div className="flex flex-col items-center z-10">
    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
      ${isActive ? color : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div className="mt-2 text-center">
      <p className="text-xs font-medium">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{date}</p>
    </div>
  </div>
);