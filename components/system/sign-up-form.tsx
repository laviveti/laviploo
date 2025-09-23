"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LogoText } from "./logo";
import { AUTH_CONFIG } from "@/lib/auth/config";
import { getErrorMessage, getMessageClassName } from "@/lib/handle-error";
import { useEmailValidation } from "@/hooks/use-email-validation";
import type { AuthFormState } from "@/types/auth";

interface SignUpFormProps extends React.ComponentProps<"div"> {}

export const SignUpForm = ({ className }: SignUpFormProps) => {
  const { isLoaded, signUp, setActive } = useSignUp();
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
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    const emailValidation = validateEmail(state.email);
    if (!emailValidation.isValid) {
      updateState({ message: emailValidation.message });
      return;
    }

    updateState({ isLoading: true, message: "" });

    try {
      // Cria a conta usando apenas o email (sem senha)
      await signUp.create({
        emailAddress: state.email,
      });

      // Prepara a verificação do email enviando o código
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      updateState({
        codeSent: true,
        message: "Conta criada! Código de verificação enviado para seu email.",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      updateState({ message: errorMessage });

      // Mostra opções de redirecionamento se usuário já existe
      if (errorMessage.includes("já existe")) {
        setTimeout(() => {
          updateState({ showRedirectOptions: true });
        }, 3000);
      }
    } finally {
      updateState({ isLoading: false });
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !state.code.trim()) {
      updateState({ message: "Por favor, insira o código de verificação" });
      return;
    }

    updateState({ isLoading: true, message: "" });

    try {
      // Tenta verificar o código
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: state.code,
      });

      // Se a verificação foi completa, ativa a sessão e redireciona
      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Se há tarefas pendentes, lida com elas
              console.log("Session tasks:", session.currentTask);
              return;
            }

            // Redireciona para o dashboard
            await router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
          }
        });

        updateState({ message: "Conta criada e login realizado com sucesso!" });
      } else {
        // Se o status não é complete, verifica o que precisa ser feito
        console.log("Sign-up não completo. Status:", signUpAttempt.status);
        updateState({ message: "Verificação não completada. Tente novamente." });
      }
    } catch (error) {
      updateState({ message: getErrorMessage(error) });
    } finally {
      updateState({ isLoading: false });
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    updateState({ isLoading: true, message: "" });

    try {
      // Prepara novamente a verificação do email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      updateState({ message: "Novo código enviado para seu email!" });
    } catch (error) {
      updateState({ message: getErrorMessage(error) });
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

  return (
    <div className={cn("w-full max-w-md mx-auto p-6", className)}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {state.codeSent ? (
              "Verifique seu email"
            ) : (
              <>
                Criar conta no <LogoText />
              </>
            )}
          </h1>
          <p className="text-gray-600">
            {state.codeSent
              ? `Enviamos um código de verificação para ${state.email}!`
              : "Digite seu email para criar sua conta"}
          </p>
        </div>

        {state.codeSent ? (
          <div className="space-y-4">
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <Input
                type="text"
                placeholder="Digite o código de 6 dígitos"
                value={state.code}
                onChange={(e) => updateState({ code: e.target.value })}
                className="w-full text-center text-lg tracking-widest"
                maxLength={6}
                disabled={state.isLoading}
              />
              <Button
                type="submit"
                className="w-full bg-lavive hover:bg-lavive/90"
                disabled={state.isLoading || !state.code.trim()}
              >
                {state.isLoading ? "Verificando..." : "Verificar Código"}
              </Button>
            </form>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
              disabled={state.isLoading}
            >
              {state.isLoading ? "Enviando..." : "Reenviar Código"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={resetForm}
              disabled={state.isLoading}
            >
              Usar outro email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder={getEmailPlaceholder()}
              value={state.email}
              onChange={(e) => updateState({ email: e.target.value })}
              className="w-full placeholder:text-xs"
              disabled={state.isLoading}
            />

            <Button
              type="submit"
              className="w-full bg-lavive hover:bg-lavive/90"
              disabled={state.isLoading}
            >
              {state.isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>

            {/* Clerk CAPTCHA container */}
            <div id="clerk-captcha" data-cl-theme="light" data-cl-size="flexible" data-cl-language="pt-BR" />
          </form>
        )}

        {state.message && (
          <p className={cn("text-sm text-center", getMessageClassName(state.message))}>
            {state.message}
          </p>
        )}

        {/* Opções de redirecionamento manual */}
        {state.showRedirectOptions && (
          <div className="text-center mt-4 p-4 bg-zinc-50 rounded-lg border">
            <p className="text-sm text-zinc-700 mb-3">
              Não conseguiu criar conta? Talvez você já tenha uma conta.
            </p>
            <div className="space-y-2">
              <Button
                type="button"
                onClick={() => router.push(AUTH_CONFIG.ROUTES.SIGN_IN)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Fazer login
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => updateState({ showRedirectOptions: false })}
                className="w-full"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}

        {/* Link para alternar para sign-in */}
        <div className="text-center mt-6">
          <Link
            href={AUTH_CONFIG.ROUTES.SIGN_IN}
            className="text-sm text-zinc-600 hover:text-zinc-900 underline"
          >
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
};