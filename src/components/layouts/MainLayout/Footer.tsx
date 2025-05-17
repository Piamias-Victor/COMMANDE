import React from 'react';

export const Footer: React.FC = () => (
  <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-sm text-gray-500">
        PharmCSV Manager © {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);