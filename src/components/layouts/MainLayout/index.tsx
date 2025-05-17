'use client';

import React from 'react';
import { useMainLayout } from '@/hooks/useMainLayout';
import { Notification } from '@/components/ui/Notification';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { session, isLinkActive, handleSignOut } = useMainLayout();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Notification />
      
      <Header 
        session={session} 
        isLinkActive={isLinkActive} 
        onSignOut={handleSignOut} 
      />
      
      <main className="flex-grow animation-fade-in">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};