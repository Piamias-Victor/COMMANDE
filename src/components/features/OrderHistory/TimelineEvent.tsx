import React from 'react';
import { TimelineEvent as TimelineEventType, EventType } from '@/hooks/useOrderHistory';
import { EventIcon } from './EventIcon';
import { EventDetails } from './EventDetails';

interface TimelineEventProps {
  event: TimelineEventType;
  formatDate: (date: Date) => string;
  getEventColor: (type: EventType, title: string) => string;
  getEventIcon: (type: EventType, title: string) => string;
}

export const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  formatDate,
  getEventColor,
  getEventIcon
}) => (
  <div className="flex items-start relative">
    <EventIcon 
      type={event.type} 
      title={event.title} 
      getEventColor={getEventColor} 
      getEventIcon={getEventIcon} 
    />
    
    <EventDetails 
      title={event.title} 
      description={event.description} 
      date={formatDate(event.date)} 
      actor={event.actor} 
    />
  </div>
);