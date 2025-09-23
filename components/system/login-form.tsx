"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LogoText } from "./logo";
import { AUTH_CONFIG } from "@/lib/auth/config";
import { getErrorMessage, getMessageClassName } from "@/lib/handle-error";
import { useEmailValidation } from "@/hooks/use-email-validation";
import { authClient } from "@/lib/auth/client";
import type { AuthFormState } from "@/types/auth";

interface LoginFormProps extends React.ComponentProps<"div"> {}

export const LoginForm = ({ className }: LoginFormProps) => {
  const { validateEmail, getEmailPlaceholder } = useEmailValidation();
  const router = useRouter();

  const [state, setState] = useState<AuthFormState>({
    email: "",
    code: "",
    isLoading: false,
    codeSent: false,
    message: "",
    showRedirectOptions: false,
  });

  const updateState = (updates: Partial<AuthFormState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(state.email);
    if (!emailValidation.isValid) {
      updateState({ message: emailValidation.message });
      return;
    }

    updateState({ isLoading: true, message: "" });

    try {
      const { data, error } = await authClient.signIn.magicLink({
        email: state.email,
        callbackURL: AUTH_CONFIG.ROUTES.DASHBOARD,
      });

      if (error) {
        throw new Error(error.message);
      }

      updateState({
        codeSent: true,
        message: "Link mágico enviado para seu email! Verifique sua caixa de entrada.",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const resetForm = () => {
    setState({
      email: "",
      code: "",
      isLoading: false,
      codeSent: false,
      message: "",
      showRedirectOptions: false,
    });
  };

  const handleResendMagicLink = async () => {
    updateState({ isLoading: true, message: "" });

    try {
      const { data, error } = await authClient.signIn.magicLink({
        email: state.email,
        callbackURL: AUTH_CONFIG.ROUTES.DASHBOARD,
      });

      if (error) {
        throw new Error(error.message);
      }

      updateState({ message: "Novo link mágico enviado para seu email!" });
    } catch (error) {
      updateState({ message: getErrorMessage(error) });
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold text-gray-900'>
          {state.codeSent ? (
            "Verifique seu email"
          ) : (
            <>
              Entrar no <LogoText />
            </>
          )}
        </h1>
        <p className='text-gray-600'>
          {state.codeSent
            ? `Enviamos um link mágico para ${state.email}! Clique no link para fazer login.`
            : "Digite seu email para receber um link de acesso"}
        </p>
      </div>

      {state.codeSent ? (
        <div className='space-y-4'>
          <div className='text-center p-4 bg-green-50 rounded-lg border border-green-200'>
            <p className='text-green-800 text-sm mb-3'>✅ Link enviado com sucesso!</p>
            <p className='text-green-700 text-xs mb-2'>Verifique sua caixa de entrada e clique no link para acessar sua conta.</p>
            <div className='bg-yellow-50 border border-yellow-200 rounded p-2 mt-2'>
              <p className='text-yellow-800 text-xs'>⏱️ Este link expira em 5 minutos por motivos de segurança.</p>
              <p className='text-yellow-700 text-xs mt-1'>Não recebeu o email? Verifique sua pasta de spam ou lixo eletrônico.</p>
            </div>
          </div>

          <div className='text-center text-xs text-gray-500'>
            <p>
              Enviado para: <span className='font-medium'>{state.email}</span>
            </p>
          </div>

          <Button type='button' variant='outline' className='w-full' onClick={handleResendMagicLink} disabled={state.isLoading}>
            {state.isLoading ? "Enviando..." : "Reenviar Link"}
          </Button>

          <Button type='button' variant='ghost' className='w-full' onClick={resetForm} disabled={state.isLoading}>
            Usar outro email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            type='email'
            placeholder={getEmailPlaceholder()}
            value={state.email}
            onChange={(e) => updateState({ email: e.target.value })}
            className='w-full placeholder:text-xs'
            disabled={state.isLoading}
          />

          <Button type='submit' className='w-full bg-lavive hover:bg-lavive/90' disabled={state.isLoading}>
            {state.isLoading ? "Enviando..." : "Enviar Link de Acesso"}
          </Button>
        </form>
      )}

      {state.message && <p className={cn("text-sm text-center", getMessageClassName(state.message))}>{state.message}</p>}

      {/* Mensagem informativa */}
      <div className='text-center mt-6'>
        <p className='text-sm text-zinc-600'>Acesso exclusivo para usuários autorizados</p>
      </div>
    </div>
  );
};
