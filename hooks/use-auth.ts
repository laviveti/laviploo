"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import type { User, Session } from "@/lib/auth/better-auth";

interface AuthState {
  user: User | null;
  session: any | null; // Usar any temporariamente para evitar conflitos de tipo
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();

        if (session.data) {
          setAuthState({
            user: session.data.user,
            session: session.data,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setAuthState({
          user: null,
          session: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      await authClient.signOut();
      setAuthState({
        user: null,
        session: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return {
    ...authState,
    signOut,
    isAuthenticated: !!authState.user,
  };
}