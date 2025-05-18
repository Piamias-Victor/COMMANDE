// src/components/features/Login/index.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { useLogin } from '@/hooks/useLogin';
import { LoginForm } from './LoginForm';
import { DemoAccounts } from './DemoAccounts';

interface LoginProps {
  callbackUrl?: string;
}

export const Login: React.FC<LoginProps> = ({ callbackUrl = '/' }) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoggingIn,
    handleSubmit
  } = useLogin(callbackUrl);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="max-w-md w-full p-8 bg-white dark:bg-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            PharmCSV Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connectez-vous à votre espace pharmacie
          </p>
        </div>
        
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoggingIn={isLoggingIn}
          onSubmit={handleSubmit}
        />
        
        <DemoAccounts />
      </Card>
    </div>
  );
};