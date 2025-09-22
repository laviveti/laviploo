"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { EmailLinkErrorCodeStatus, isEmailLinkError } from "@clerk/nextjs/errors";

import { AUTH_CONFIG, buildAbsoluteUrl } from "@/lib/auth/config";
import type { VerificationStatus, VerificationCopy } from "@/lib/auth/types";

const STATUS_COPY: Record<VerificationStatus, VerificationCopy> = {
  loading: {
    title: "Verificando link...",
    description: "Estamos confirmando as informações do seu acesso.",
  },
  verified: {
    title: "Tudo certo!",
    description: "Login confirmado. Redirecionando...",
  },
  expired: {
    title: "Link expirado",
    description: "Solicite um novo link mágico para tentar novamente.",
  },
  client_mismatch: {
    title: "Dispositivo diferente",
    description:
      "Finalize o acesso no mesmo dispositivo e navegador onde o login foi iniciado ou solicite outro link.",
  },
  failed: {
    title: "Não foi possível validar",
    description: "O link pode estar incorreto ou já foi utilizado.",
  },
};

interface UseMagicLinkVerificationReturn {
  status: VerificationStatus;
  copy: VerificationCopy;
}

export const useMagicLinkVerification = (): UseMagicLinkVerificationReturn => {
  const { handleEmailLinkVerification, loaded } = useClerk();
  const [status, setStatus] = useState<VerificationStatus>("loading");

  useEffect(() => {
    if (!loaded) return;

    const verifyEmail = async () => {
      try {
        const result = await handleEmailLinkVerification({
          redirectUrl: buildAbsoluteUrl(AUTH_CONFIG.ROUTES.SIGN_IN),
        });

        if (result?.status === "complete") {
          setStatus("verified");

          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.replace(AUTH_CONFIG.ROUTES.DASHBOARD);
            }
          }, AUTH_CONFIG.TIMING.VERIFICATION_DELAY_MS);
        }
      } catch (error: unknown) {
        console.log("Verification error:", error);

        if (error instanceof Error && isEmailLinkError(error)) {
          if (error.code === EmailLinkErrorCodeStatus.Expired) {
            setStatus("expired");
            return;
          }

          if (error.code === EmailLinkErrorCodeStatus.ClientMismatch) {
            setStatus("client_mismatch");
            return;
          }
        }

        setStatus("failed");
      }
    };

    verifyEmail();
  }, [handleEmailLinkVerification, loaded]);

  return {
    status,
    copy: STATUS_COPY[status],
  };
};