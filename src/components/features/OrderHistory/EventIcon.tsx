import React from 'react';
import { EventType } from '@/hooks/useOrderHistory';

interface EventIconProps {
  type: EventType;
  title: string;
  getEventColor: (type: EventType, title: string) => string;
  getEventIcon: (type: EventType, title: string) => string;
}

export const EventIcon: React.FC<EventIconProps> = ({
  type,
  title,
  getEventColor,
  getEventIcon
}) => (
  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10 ${getEventColor(type, title)}`}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 text-white" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={getEventIcon(type, title)} 
      />
    </svg>
  </div>
);