// src/components/ui/Tabs.tsx
import React, { createContext, useContext, useState } from 'react';
import clsx from 'clsx';

interface TabsContextType {
  activeValue: string;
  setActiveValue: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  className,
  children
}) => {
  const [activeValue, setActiveValue] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeValue, setActiveValue }}>
      <div className={clsx('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({
  className,
  children
}) => {
  return (
    <div className={clsx('flex border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  className,
  children
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  
  const { activeValue, setActiveValue } = context;
  const isActive = activeValue === value;
  
  return (
    <button
      type="button"
      className={clsx(
        'py-2 px-4 text-sm font-medium border-b-2 -mb-px', 
        isActive 
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
        className
      )}
      onClick={() => setActiveValue(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  className,
  children
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }
  
  const { activeValue } = context;
  
  if (activeValue !== value) {
    return null;
  }
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};