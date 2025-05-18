// src/hooks/useLogin.ts
import { useState, useCallback } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useLogin(callbackUrl: string = '/') {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
        callbackUrl,
      });
      
      if (result?.error) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.success('Connexion réussie');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoggingIn(false);
    }
  }, [email, password, router, callbackUrl]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoggingIn,
    handleSubmit
  };
}