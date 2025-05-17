import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function useMainLayout() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const isLinkActive = useCallback((href: string) => {
    return pathname === href;
  }, [pathname]);
  
  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: '/login' });
  }, []);
  
  return {
    session,
    isLinkActive,
    handleSignOut
  };
}