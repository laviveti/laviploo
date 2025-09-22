"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LogoText } from "./logo";

interface SignInFormProps extends React.ComponentProps<"div"> {}

export const SignInForm = ({ className }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { signIn } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Por favor, insira seu email");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn?.create({
        strategy: "email_code",
        identifier: email,
      });

      // Para email_code, precisamos ir para verificação
      if (result?.status === "needs_first_factor") {
        setMessage("Código enviado para seu email! Verifique sua caixa de entrada.");
        // Aqui você poderia redirecionar para uma página de verificação
        // ou mostrar um campo de código na mesma tela
      } else {
        setMessage("Link de acesso enviado para seu email!");
      }
    } catch (error: any) {
      console.error("Magic link error:", error);
      const errorMessage = error?.errors?.[0]?.longMessage || error?.message || "Erro ao enviar link. Tente novamente.";
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto p-6", className)}>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold text-gray-900'>
            Entrar no <LogoText />
          </h1>
          <p className='text-gray-600'>Digite seu e-mail para receber um link de acesso</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Input
              type='email'
              placeholder='O e-mail deve estar no domínio "lavive.com.br"'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full placeholder:text-xs'
              disabled={isLoading}
            />
          </div>

          <Button type='submit' className='w-full bg-lavive hover:bg-lavive/90' disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Link de Acesso"}
          </Button>

          {message && <p className={cn("text-sm text-center", message.includes("enviado") ? "text-green-600" : "text-red-600")}>{message}</p>}
        </form>
      </div>
    </div>
  );
};
