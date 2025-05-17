import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Navigation } from './Navigation';

interface HeaderProps {
  session: any;
  isLinkActive: (href: string) => boolean;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  isLinkActive,
  onSignOut
}) => (
  <header className="bg-white dark:bg-gray-800 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
              PharmCSV Manager
            </Link>
          </div>
          <Navigation isLinkActive={isLinkActive} />
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
            onClick={onSignOut}
          >
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  </header>
);