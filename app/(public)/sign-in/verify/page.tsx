"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoText } from "@/components/system/logo";
import { useMagicLinkVerification } from "@/hooks/use-magic-link-verification";
import { AUTH_CONFIG } from "@/lib/auth/config";

export default function VerifyMagicLinkPage() {
  const { status, copy } = useMagicLinkVerification();

  return (
    <section className="bg-white relative flex flex-col h-screen">
      <div className="flex absolute w-full top-1/2 -translate-y-1/2 px-4">
        <div className="w-full max-w-md mx-auto p-6 space-y-6 text-center border border-zinc-200 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            {copy.title}
            <LogoText />
          </h1>
          <p className="text-gray-600">{copy.description}</p>

          {status === "verified" ? (
            <p className="text-sm text-green-600">Você será redirecionado automaticamente.</p>
          ) : null}

          {status !== "verified" ? (
            <div className="space-y-3">
              <Button asChild className="w-full bg-lavive hover:bg-lavive/90">
                <Link href={AUTH_CONFIG.ROUTES.SIGN_IN}>Voltar para o login</Link>
              </Button>
              {status === "expired" || status === "client_mismatch" ? (
                <p className="text-xs text-gray-500">
                  Precisa de um novo link? Volte e solicite novamente com o mesmo email.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <footer className="justify-center h-fit mt-auto p-2 flex">
        <h6 className="font-semibold text-xs text-zinc-500">Desenvolvido com ❤️ pela equipe de TI.</h6>
      </footer>
    </section>
  );
}
