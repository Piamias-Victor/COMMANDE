import React from 'react';

export const DemoAccounts: React.FC = () => (
  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
    <div className="text-sm text-gray-600 dark:text-gray-400">
      <p className="mb-2">Utilisateurs de démonstration :</p>
      <ul className="space-y-1">
        <li>centrale@example.com / password1</li>
        <li>port@example.com / password2</li>
        <li>alpes@example.com / password3</li>
        <li>gare@example.com / password4</li>
        <li>etoile@example.com / password5</li>
      </ul>
    </div>
  </div>
);