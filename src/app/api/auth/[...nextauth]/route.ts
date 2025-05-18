// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Liste des pharmacies pour la démonstration avec des IDs fixes
const pharmacies = [
  { 
    id: "pharmacy-1",
    name: 'Pharmacie Centrale', 
    email: 'centrale@example.com',
    password: 'password1'
  },
  { 
    id: "pharmacy-2",
    name: 'Pharmacie du Port', 
    email: 'port@example.com',
    password: 'password2'
  },
  { 
    id: "pharmacy-3",
    name: 'Pharmacie des Alpes', 
    email: 'alpes@example.com',
    password: 'password3'
  },
  { 
    id: "pharmacy-4",
    name: 'Pharmacie de la Gare', 
    email: 'gare@example.com',
    password: 'password4'
  },
  { 
    id: "pharmacy-5",
    name: 'Pharmacie de l\'Étoile', 
    email: 'etoile@example.com',
    password: 'password5'
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const pharmacy = pharmacies.find(
          (pharmacy) => 
            pharmacy.email.toLowerCase() === credentials.email.toLowerCase() && 
            pharmacy.password === credentials.password
        );

        if (!pharmacy) {
          return null;
        }

        return {
          id: pharmacy.id,
          name: pharmacy.name,
          email: pharmacy.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "default-secret-key-change-in-production",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };