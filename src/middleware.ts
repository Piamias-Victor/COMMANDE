// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Liste des chemins publics qui ne nécessitent pas d'authentification
const publicPaths = ['/login'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Vérifier si le chemin est public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Vérifier si l'utilisateur est authentifié
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Si non authentifié et pas sur un chemin public, rediriger vers la page de connexion
  if (!token) {
    const url = new URL('/login', request.url);
    // Ajouter le paramètre callbackUrl pour rediriger après connexion
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configuration du middleware pour qu'il s'exécute sur toutes les routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};