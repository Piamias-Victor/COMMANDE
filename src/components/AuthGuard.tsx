'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Corriger cette ligne pour utiliser la propriété status correctement
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Les routes qui ne nécessitent pas d'authentification
    const publicRoutes = ['/login'];
    
    if (status === 'unauthenticated' && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated' && pathname !== '/login') {
    return null; // Ne rien afficher pendant la redirection
  }

  return <>{children}</>;
};