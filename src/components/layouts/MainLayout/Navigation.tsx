import React from 'react';
import Link from 'next/link';

interface NavigationProps {
  isLinkActive: (href: string) => boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ isLinkActive }) => {
  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/orders', label: 'Commandes' },
    { href: '/stats', label: 'Statistiques' }
  ];
  
  return (
    <nav className="ml-6 flex items-center space-x-4 sm:space-x-8">
      {navLinks.map(({ href, label }) => (
        <Link 
          key={href}
          href={href} 
          className={`inline-flex items-center px-1 py-1 border-b-2 ${
            isLinkActive(href) 
              ? 'border-blue-500 text-gray-900 dark:text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white hover:border-blue-500'
          } text-sm font-medium transition-colors`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};