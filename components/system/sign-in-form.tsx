"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LogoText } from "./logo";
import { useEmailAuth } from "@/hooks/use-magic-link-auth";
import { AUTH_CONFIG } from "@/lib/auth/config";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SignInFormProps extends React.ComponentProps<"div"> {}

const isDev = process.env.NODE_ENV === "development";

export const SignInForm = ({ className }: SignInFormProps) => {
  const { state, actions, sendMagicLink, resendMagicLink, verifyCode } = useEmailAuth();
  const pathname = usePathname();

  // Detecta se estamos na rota de sign-up
  const isSignUpRoute = pathname?.includes('/sign-up');
  const alternativeRoute = isSignUpRoute ? '/sign-in' : '/sign-up';
  const alternativeText = isSignUpRoute ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Crie uma';

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

    // 1. PRIMEIRO: Frases específicas que devem ser VERDE (sucesso)
    const successPhrases = [
      "código de verificação enviado",
      "link de verificação enviado",
      "conta criada! código de verificação enviado",
      "login realizado com sucesso",
      "conta criada e login realizado",
      "login concluído! redirecionando",
      "tudo certo",
      "login já realizado com sucesso",
      "enviamos um link mágico",
      "criamos sua conta e enviamos",
    ];

    // 2. SEGUNDO: Frases específicas que devem ser VERMELHO (erro)
    const errorPhrases = [
      "por favor, insira",
      "por favor insira", // variação sem vírgula
      "email deve estar no domínio",
      "o email deve estar no domínio",
      "email inválido",
      "código inválido",
      "código expirado",
      "já foi usado",
      "already been verified",
      "este código já foi usado",
      "aguarde",
      "muitas tentativas",
      "limite excedido",
      "too many requests",
      "try again",
      "tente novamente",
      "autenticação de dois fatores",
      "entre em contato com o administrador",
      "bloqueado temporariamente",
      "serviço de autenticação indisponível",
      "serviço de cadastro indisponível",
      "serviço indisponível",
      "método de magic link não está habilitado",
      "o link gerado expirou",
      "erro ao enviar",
      "erro ao criar conta",
      "falha na",
      "não foi possível validar",
      "não foi possível",
      "problema de conexão",
      "verifique o código",
      "solicite um novo",
      "missing_requirements",
      "informações adicionais necessárias",
      "domínio lavive.com.br ou ser gmail",
      "conta não encontrada",
      "redirecionando para criar conta",
      "esta conta já existe",
      "redirecionando para o login",
    ];

    // 3. Palavras-chave de ERRO (mais amplas)
    const errorKeywords = [
      "erro", "error",
      "falhou", "failed", "fail",
      "inválido", "invalid",
      "incorreto", "incorrect",
      "expirado", "expired",
      "bloqueado", "blocked",
      "negado", "denied",
      "rejeitado", "rejected",
      "indisponível", "unavailable",
      "timeout", "connection", "network",
      "401", "403", "404", "500",
    ];

    // 4. Palavras-chave de SUCESSO (mais amplas)
    const successKeywords = [
      "enviado", "sent",
      "sucesso", "success", "successful",
      "completado", "completed", "complete",
      "verificado", "verified",
      "confirmado", "confirmed",
      "realizado",
      "redirecionando",
    ];

    // LÓGICA DE DECISÃO (em ordem de prioridade):

    // 1º - Verifica frases específicas de SUCESSO (prioridade máxima)
    const hasSuccessPhrase = successPhrases.some(phrase => lowerMessage.includes(phrase));
    if (hasSuccessPhrase) {
      console.log(`✅ VERDE: "${message}" | Success phrase detected`);
      return "text-green-600";
    }

    // 2º - Verifica frases específicas de ERRO (prioridade alta)
    const hasErrorPhrase = errorPhrases.some(phrase => lowerMessage.includes(phrase));
    if (hasErrorPhrase) {
      console.log(`❌ VERMELHO: "${message}" | Error phrase detected`);
      return "text-red-600";
    }

    // 3º - Verifica palavras-chave de ERRO (prioridade média)
    const hasErrorKeyword = errorKeywords.some(keyword => lowerMessage.includes(keyword));
    if (hasErrorKeyword) {
      console.log(`❌ VERMELHO: "${message}" | Error keyword detected`);
      return "text-red-600";
    }

    // 4º - Verifica palavras-chave de SUCESSO (prioridade baixa)
    const hasSuccessKeyword = successKeywords.some(keyword => lowerMessage.includes(keyword));
    if (hasSuccessKeyword) {
      console.log(`✅ VERDE: "${message}" | Success keyword detected`);
      return "text-green-600";
    }

    // 5º - DEFAULT: Se não encontrou nada específico, assume que é erro
    // (porque a maioria das mensagens não categorizadas são de validação)
    console.log(`⚠️ VERMELHO (default): "${message}" | No specific match found`);
    return "text-red-600";
  };

  return (
    <div className={cn("w-full max-w-md mx-auto p-6", className)}>
      <div className='space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {state.linkSent || state.codeSent
              ? "Verifique seu email"
              : isSignUpRoute
                ? <>Criar conta no <LogoText /></>
                : <>Entrar no <LogoText /></>
            }
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

            {/* Clerk CAPTCHA container */}
            <div id="clerk-captcha" data-cl-theme="light" data-cl-size="flexible" data-cl-language="pt-BR" />

            {state.message && (
              <p className={cn("text-sm text-center", getMessageColor(state.message))}>
                {state.message}
              </p>
            )}
          </form>
        )}

        {/* Opções de redirecionamento manual para sign-in */}
        {state.showRedirectOptions && !isSignUpRoute && (
          <div className="text-center mt-4 p-4 bg-zinc-50 rounded-lg border">
            <p className="text-sm text-zinc-700 mb-3">
              Não conseguiu fazer login? Talvez você precise criar uma conta.
            </p>
            <div className="space-y-2">
              <Button
                type="button"
                onClick={actions.goToSignUp}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Criar uma conta
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => actions.resetState()}
                className="w-full"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}

        {/* Opções de redirecionamento manual para sign-up */}
        {state.showRedirectOptions && isSignUpRoute && (
          <div className="text-center mt-4 p-4 bg-zinc-50 rounded-lg border">
            <p className="text-sm text-zinc-700 mb-3">
              Não conseguiu criar conta? Talvez você já tenha uma conta.
            </p>
            <div className="space-y-2">
              <Button
                type="button"
                onClick={actions.goToSignIn}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                Fazer login
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => actions.resetState()}
                className="w-full"
              >
                Tentar novamente
              </Button>
            </div>
          </div>
        )}

        {/* Link para alternar entre sign-in e sign-up */}
        <div className="text-center mt-6">
          <Link
            href={alternativeRoute}
            className="text-sm text-zinc-600 hover:text-zinc-900 underline"
          >
            {alternativeText}
          </Link>
        </div>
      </div>
    </div>
  );
};