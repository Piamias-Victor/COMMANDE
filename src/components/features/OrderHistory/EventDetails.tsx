import React from 'react';

interface EventDetailsProps {
  title: string;
  description: string;
  date: string;
  actor?: string;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  title,
  description,
  date,
  actor
}) => (
  <div className="ml-4 flex-grow">
    <div className="flex items-center justify-between">
      <h4 className="text-md font-medium">{title}</h4>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {date}
      </span>
    </div>
    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
      {description}
    </p>
    {actor && (
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Par: {actor}
      </p>
    )}
  </div>
);