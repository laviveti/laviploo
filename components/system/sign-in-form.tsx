"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LogoText } from "./logo";
import { useEmailAuth } from "@/hooks/use-magic-link-auth";
import { AUTH_CONFIG } from "@/lib/auth/config";

interface SignInFormProps extends React.ComponentProps<"div"> {}

const isDev = process.env.NODE_ENV === "development";

export const SignInForm = ({ className }: SignInFormProps) => {
  const { state, actions, sendMagicLink, resendMagicLink, verifyCode } = useEmailAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMagicLink();
  };

  const handleUseOtherEmail = () => {
    actions.resetState();
    actions.setEmail("");
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyCode();
  };

  const getMessageColor = (message: string) => {
    const lowerMessage = message.toLowerCase();
    const isError = lowerMessage.includes("erro") ||
                   lowerMessage.includes("não") ||
                   lowerMessage.includes("does not match") ||
                   lowerMessage.includes("falhou") ||
                   lowerMessage.includes("inválido") ||
                   lowerMessage.includes("indisponível") ||
                   lowerMessage.includes("verificação") && lowerMessage.includes("não está");

    return isError ? "text-red-600" : "text-green-600";
  };

  return (
    <div className={cn("w-full max-w-md mx-auto p-6", className)}>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {state.linkSent || state.codeSent ? "Verifique seu email" : <>Entrar no <LogoText /></>}
          </h1>
          <p className='text-gray-600'>
            {state.linkSent
              ? `Enviamos um link de verificação para ${state.email}!`
              : state.codeSent
              ? `Enviamos um código de verificação para ${state.email}!`
              : "Digite seu email para receber um código de verificação"}
          </p>
        </div>

        {state.codeSent ? (
          <div className="space-y-4">
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Digite o código de 6 dígitos"
                  value={state.verificationCode}
                  onChange={(e) => actions.setVerificationCode(e.target.value)}
                  className="w-full text-center text-lg tracking-widest"
                  maxLength={6}
                  disabled={state.isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-lavive hover:bg-lavive/90"
                disabled={state.isLoading || !state.verificationCode.trim()}
              >
                {state.isLoading ? "Verificando..." : "Verificar Código"}
              </Button>
            </form>

            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={resendMagicLink}
              disabled={state.isLoading}
            >
              {state.isLoading ? "Enviando..." : "Reenviar Código"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleUseOtherEmail}
              disabled={state.isLoading}
            >
              Usar outro email
            </Button>

            {state.message && (
              <p className={cn("text-sm text-center", getMessageColor(state.message))}>
                {state.message}
              </p>
            )}
          </div>
        ) : state.linkSent ? (
          <div className="space-y-4">
            <Button
              type="button"
              className="w-full bg-lavive hover:bg-lavive/90"
              onClick={resendMagicLink}
              disabled={state.isLoading}
            >
              {state.isLoading ? "Enviando..." : "Reenviar Link"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleUseOtherEmail}
              disabled={state.isLoading}
            >
              Usar outro email
            </Button>
            <p className="text-sm text-center text-gray-500">
              {state.isSignUpFlow
                ? "Após confirmar o link, vamos pedir outras informações básicas, se necessário."
                : "Abra o link no mesmo dispositivo para entrar automaticamente."}
            </p>
            {state.message && (
              <p className={cn("text-sm text-center", getMessageColor(state.message))}>
                {state.message}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Input
                type='email'
                placeholder={isDev ? 'Digite seu e-mail com o domínio @lavive.com.br ou Gmail (modo dev)' : 'Digite seu e-mail com o domínio @lavive.com.br'}
                value={state.email}
                onChange={(e) => actions.setEmail(e.target.value)}
                className='w-full placeholder:text-xs'
                disabled={state.isLoading}
              />
            </div>

            <Button type='submit' className='w-full bg-lavive hover:bg-lavive/90' disabled={state.isLoading}>
              {state.isLoading ? "Enviando..." : "Enviar Código de Verificação"}
            </Button>

            {state.message && (
              <p className={cn("text-sm text-center", getMessageColor(state.message))}>
                {state.message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};