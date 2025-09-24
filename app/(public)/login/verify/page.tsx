"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { AUTH_CONFIG } from "@/lib/auth/config";
import { LogoText } from "@/components/system/logo";

export default function VerifyMagicLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyMagicLink = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Token de verificação não encontrado.");
        return;
      }

      try {
        const { data, error } = await authClient.magicLink.verify({
          query: {
            token,
            callbackURL: AUTH_CONFIG.ROUTES.DASHBOARD,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        setStatus("success");
        setMessage("Login realizado com sucesso! Redirecionando...");

        // Redireciona após 2 segundos
        setTimeout(() => {
          router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Erro ao verificar o link");
      }
    };

    verifyMagicLink();
  }, [searchParams, router]);

  return (
    <div className='w-full space-y-6 text-center'>
      <h1 className='text-2xl font-bold text-gray-900'>
        Verificando acesso ao <LogoText />
      </h1>

      {status === "loading" && (
        <div className='space-y-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto'></div>
          <p className='text-gray-600'>Verificando seu link de acesso...</p>
        </div>
      )}

      {status === "success" && (
        <div className='space-y-4'>
          <div className='text-green-600 text-4xl'>✅</div>
          <p className='text-green-700 font-medium'>{message}</p>
        </div>
      )}

      {status === "error" && (
        <div className='space-y-4'>
          <div className='text-red-600 text-4xl'>❌</div>
          <p className='text-red-700'>{message}</p>
          <div className='space-y-2'>
            <button
              onClick={() => router.push("/login")}
              className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors'>
              Voltar ao Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
