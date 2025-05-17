import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoggingIn: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoggingIn,
  onSubmit
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
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
);