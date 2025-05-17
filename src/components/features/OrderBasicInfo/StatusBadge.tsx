import React from 'react';
import { OrderStatus } from '@/types';
import { STATUS_STYLES, STATUS_LABELS } from '@/hooks/useOrderBasicInfo';

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}>
    {STATUS_LABELS[status]}
  </span>
);