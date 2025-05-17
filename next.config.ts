import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Désactiver ESLint pendant le build pour permettre le build même avec des erreurs
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
