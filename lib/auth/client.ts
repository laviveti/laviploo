"use client";

import { createAuthClient } from "better-auth/client";
import { magicLinkClient, multiSessionClient } from "better-auth/client/plugins";

// Detecta automaticamente a URL base (funciona com qualquer porta)
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // Fallback para SSR
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
};

export const authClient = createAuthClient({
  baseURL: process.env.NODE_ENV === "production" 
    ? (process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com")
    : getBaseURL(),
  plugins: [
    magicLinkClient(),
    multiSessionClient(), // Plugin nativo para múltiplas sessões
  ],
});

export { authClient as auth };
