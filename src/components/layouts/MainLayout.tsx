'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Notification } from '@/components/ui/Notification';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const isLinkActive = (href: string) => {
    return pathname === href;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Notification />
      
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  PharmCSV Manager
                </Link>
              </div>
              <nav className="ml-6 flex items-center space-x-4 sm:space-x-8">
                <Link 
                  href="/" 
                  className={`inline-flex items-center px-1 py-1 border-b-2 ${
                    isLinkActive('/') 
                      ? 'border-blue-500 text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-blue-500'
                  } text-sm font-medium transition-colors`}
                >
                  Accueil
                </Link>
                <Link 
                  href="/orders" 
                  className={`inline-flex items-center px-1 py-1 border-b-2 ${
                    isLinkActive('/orders') 
                      ? 'border-blue-500 text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-blue-500'
                  } text-sm font-medium transition-colors`}
                >
                  Commandes
                </Link>
                <Link 
                  href="/stats" 
                  className={`inline-flex items-center px-1 py-1 border-b-2 ${
                    isLinkActive('/stats') 
                      ? 'border-blue-500 text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-blue-500'
                  } text-sm font-medium transition-colors`}
                >
                  Statistiques
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center">
              {session?.user && (
                <div className="mr-4 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{session.user.name}</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow animation-fade-in">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            PharmCSV Manager © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};