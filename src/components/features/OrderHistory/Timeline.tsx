import React from 'react';
import { TimelineEvent as TimelineEventType, EventType } from '@/hooks/useOrderHistory';
import { TimelineConnector } from './TimelineConnector';
import { TimelineEvent } from './TimelineEvent';

interface TimelineProps {
  events: TimelineEventType[];
  formatDate: (date: Date) => string;
  getEventColor: (type: EventType, title: string) => string;
  getEventIcon: (type: EventType, title: string) => string;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  formatDate,
  getEventColor,
  getEventIcon
}) => (
  <div className="relative">
    <TimelineConnector />
    
    <div className="space-y-6">
      {events.map((event) => (
        <TimelineEvent
          key={event.id}
          event={event}
          formatDate={formatDate}
          getEventColor={getEventColor}
          getEventIcon={getEventIcon}
        />
      ))}
    </div>
  </div>
);