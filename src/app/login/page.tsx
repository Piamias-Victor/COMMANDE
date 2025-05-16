'use client';

import React, { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.success('Connexion réussie');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoggingIn(false);
    }
  };

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
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre-email@exemple.com"
            required
            fullWidth
          />
          
          <Input
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            required
            fullWidth
          />
          
          <Button 
            variant="primary" 
            type="submit" 
            fullWidth
            loading={isLoggingIn}
          >
            Se connecter
          </Button>
        </form>
        
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
      </Card>
    </div>
  );
}