"use client";

import { useCallback, useState } from "react";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import type { EmailCodeFactor, EmailLinkFactor } from "@clerk/types";

import { AUTH_CONFIG, buildAbsoluteUrl } from "@/lib/auth/config";
import {
  parseAuthError,
  parseSignUpError,
  isUserNotFoundError,
  validateEmail,
  checkDebounce,
  getClerkErrorCode,
} from "@/lib/auth/errors";
import type { AuthState, AuthHookReturn } from "@/lib/auth/types";

const isDev = process.env.NODE_ENV === "development";

// Função utilitária para log seguro de objetos Clerk (evita referências circulares)
const safeLogClerkObject = (name: string, obj: any) => {
  if (!obj) {
    console.log(`${name}: null/undefined`);
    return;
  }

  // Log apenas propriedades importantes sem referências circulares
  const safeProps = {
    id: obj.id,
    status: obj.status,
    createdSessionId: obj.createdSessionId,
    type: obj.constructor?.name,
  };

  console.log(`${name}:`, safeProps);
};

export const useEmailAuth = (): AuthHookReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const { signIn, isLoaded: isSignInLoaded, setActive } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { user, isLoaded: isUserLoaded } = useUser();

  // Detecta se estamos na rota de sign-up
  const isSignUpRoute = pathname?.includes('/sign-up');

  const [state, setState] = useState<AuthState>({
    email: "",
    status: "idle",
    isLoading: false,
    message: "",
    lastAttempt: 0,
    linkSent: false,
    codeSent: false,
    isSignUpFlow: false,
    verificationCode: "",
    showRedirectOptions: false,
  });

  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      email: "",
      status: "idle",
      isLoading: false,
      message: "",
      lastAttempt: 0,
      linkSent: false,
      codeSent: false,
      isSignUpFlow: false,
      verificationCode: "",
      showRedirectOptions: false,
    });
  }, []);

  const sendEmailForSignIn = useCallback(
    async (emailAddress: string) => {
      if (!isSignInLoaded || !signIn) {
        throw new Error(AUTH_CONFIG.MESSAGES.ERROR.SERVICE_UNAVAILABLE_SIGNIN);
      }

      // Primeiro, cria a tentativa de sign-in
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
      });

      // Prepara o email de verificação
      const redirectUrl = buildAbsoluteUrl(AUTH_CONFIG.ROUTES.VERIFY);

      // Debug: vamos ver quais fatores estão disponíveis
      console.log("Supported factors count:", signInAttempt.supportedFirstFactors?.length);
      console.log("Available strategies:", signInAttempt.supportedFirstFactors?.map(f => f.strategy));

      // Procura primeiro por email_code (que é o que está funcionando)
      const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
        (factor): factor is EmailCodeFactor => factor.strategy === "email_code"
      );

      if (emailCodeFactor) {
        // Usa email_code
        await signInAttempt.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        return "email_code";
      }

      // Se não tem email_code, tenta email_link
      const emailLinkFactor = signInAttempt.supportedFirstFactors?.find(
        (factor): factor is EmailLinkFactor => factor.strategy === "email_link"
      );

      if (emailLinkFactor) {
        await signInAttempt.prepareFirstFactor({
          strategy: "email_link",
          emailAddressId: emailLinkFactor.emailAddressId,
          redirectUrl,
        });
        return "email_link";
      }

      throw new Error("Verificação por email não está disponível para este usuário");
    },
    [isSignInLoaded, signIn]
  );

  const sendEmailForSignUp = useCallback(
    async (emailAddress: string) => {
      if (!isSignUpLoaded || !signUp) {
        throw new Error(AUTH_CONFIG.MESSAGES.ERROR.SERVICE_UNAVAILABLE_SIGNUP);
      }

      // Cria a conta
      const signUpAttempt = await signUp.create({
        emailAddress,
      });

      // Prepara o email de verificação
      const redirectUrl = buildAbsoluteUrl(AUTH_CONFIG.ROUTES.VERIFY);

      // Tenta primeiro com email_code
      try {
        await signUpAttempt.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        return "email_code";
      } catch (error) {
        // Se falhar, tenta com email_link
        await signUpAttempt.prepareEmailAddressVerification({
          strategy: "email_link",
          redirectUrl,
        });
        return "email_link";
      }
    },
    [isSignUpLoaded, signUp]
  );

  const verifyCode = useCallback(async () => {
    if (!state.verificationCode.trim()) {
      updateState({ message: "Por favor, insira o código de verificação" });
      return;
    }

    // Verifica se o usuário já está autenticado
    if (isUserLoaded && user) {
      console.log("Usuário já está autenticado, redirecionando...");
      updateState({
        status: "verified",
        message: "Login já realizado com sucesso!"
      });
      router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
      return;
    }

    updateState({
      isLoading: true,
      message: "",
      status: "verifying",
    });

    try {
      if (state.isSignUpFlow) {
        // Para sign-up
        if (!isSignUpLoaded || !signUp) {
          throw new Error("Serviço de cadastro indisponível");
        }

        console.log("Attempting sign-up verification with code:", state.verificationCode);
        const signUpAttempt = await signUp.attemptEmailAddressVerification({
          code: state.verificationCode,
        });

        safeLogClerkObject("Sign-up attempt", signUpAttempt);

        if (signUpAttempt.status === "complete") {
          console.log("Sign-up complete! Setting active session...");
          await setActive?.({ session: signUpAttempt.createdSessionId });
          updateState({
            status: "verified",
            message: "Conta criada e login realizado com sucesso!"
          });
          router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
        } else if (signUpAttempt.status === "missing_requirements") {
          console.log("Sign-up requires additional information. Missing requirements:", signUpAttempt.missingFields);

          // Para missing_requirements, geralmente o Clerk está pedindo informações adicionais
          // Vamos tentar completar o sign-up automaticamente se possível
          try {
            const updateResult = await signUp.update({
              // Adiciona informações básicas que podem estar faltando
              firstName: "",
              lastName: "",
            });

            console.log("Updated sign-up:", updateResult.status);

            // Tenta verificar novamente após atualizar
            if (updateResult.status === "complete") {
              await setActive?.({ session: updateResult.createdSessionId });
              updateState({
                status: "verified",
                message: "Conta criada e login realizado com sucesso!"
              });
              router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
              return;
            }
          } catch (updateError) {
            console.log("Error updating sign-up:", updateError);
          }

          updateState({
            message: "Conta criada com sucesso! Fazendo login automaticamente...",
            status: "error",
          });
        } else {
          console.log("Sign-up not complete. Status:", signUpAttempt.status);

          updateState({
            message: `Falha na verificação (${signUpAttempt.status}). Verifique o código e tente novamente.`,
            status: "error",
          });
        }
      } else {
        // Para sign-in
        if (!isSignInLoaded || !signIn) {
          throw new Error("Serviço de login indisponível");
        }

        console.log("Attempting sign-in verification with code:", state.verificationCode);
        const signInAttempt = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code: state.verificationCode,
        });

        safeLogClerkObject("Sign-in attempt", signInAttempt);

        if (signInAttempt.status === "complete") {
          console.log("Sign-in complete! Setting active session...");
          await setActive?.({ session: signInAttempt.createdSessionId });
          updateState({
            status: "verified",
            message: "Login realizado com sucesso!"
          });
          router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
        } else {
          console.log("Sign-in not complete. Status:", signInAttempt.status);

          updateState({
            message: `Falha na verificação (${signInAttempt.status}). Verifique o código e tente novamente.`,
            status: "error",
          });
        }
      }
    } catch (error: unknown) {
      console.log("Verification error:", error);

      // Parse do erro para mensagem mais específica
      const errorObj = error as any;
      let errorMessage = "Código inválido ou expirado. Tente novamente.";

      if (errorObj?.errors?.[0]?.longMessage) {
        errorMessage = errorObj.errors[0].longMessage;
      } else if (errorObj?.errors?.[0]?.message) {
        errorMessage = errorObj.errors[0].message;
      } else if (errorObj?.message) {
        errorMessage = errorObj.message;
      }

      // Traduz erros comuns
      const lowerErrorMessage = errorMessage.toLowerCase();

      if (lowerErrorMessage.includes("too many requests")) {
        errorMessage = "Muitas tentativas realizadas. Aguarde alguns minutos antes de tentar novamente.";
      } else if (lowerErrorMessage.includes("rate limit")) {
        errorMessage = "Limite de tentativas excedido. Aguarde antes de tentar novamente.";
      } else if (lowerErrorMessage.includes("two-factor") ||
                 lowerErrorMessage.includes("2fa") ||
                 lowerErrorMessage.includes("mfa")) {
        errorMessage = "Esta conta tem autenticação de dois fatores habilitada. Entre em contato com o administrador.";
      } else if (lowerErrorMessage.includes("invalid code")) {
        errorMessage = "Código inválido. Verifique e tente novamente.";
      } else if (lowerErrorMessage.includes("expired")) {
        errorMessage = "Código expirado. Solicite um novo código.";
      } else if (lowerErrorMessage.includes("blocked")) {
        errorMessage = "Conta temporariamente bloqueada. Aguarde ou entre em contato com o administrador.";
      } else if (lowerErrorMessage.includes("already been verified") || lowerErrorMessage.includes("já foi verificado")) {
        // Se o código já foi verificado, pode ser que a sessão já esteja ativa
        // Vamos tentar verificar se há uma sessão ativa e redirecionar
        try {
          if (state.isSignUpFlow) {
            // Para sign-up, vamos tentar obter a sessão ativa
            if (signUp?.status === "complete" && signUp.createdSessionId) {
              await setActive?.({ session: signUp.createdSessionId });
              updateState({
                status: "verified",
                message: "Login realizado com sucesso!"
              });
              router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
              return;
            }
          } else {
            // Para sign-in, vamos tentar obter a sessão ativa
            if (signIn?.status === "complete" && signIn.createdSessionId) {
              await setActive?.({ session: signIn.createdSessionId });
              updateState({
                status: "verified",
                message: "Login realizado com sucesso!"
              });
              router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
              return;
            }
          }
        } catch (sessionError) {
          console.log("Erro ao tentar ativar sessão existente:", sessionError);
        }

        errorMessage = "Este código já foi usado. Solicite um novo código.";
      }

      updateState({
        message: errorMessage,
        status: "error",
      });
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.verificationCode, state.isSignUpFlow, isSignInLoaded, isSignUpLoaded, isUserLoaded, signIn, signUp, setActive, router, updateState, user]);

  const sendEmail = useCallback(async () => {
    const emailValidation = validateEmail(state.email, isDev);
    if (!emailValidation.isValid) {
      updateState({ message: emailValidation.message || "" });
      return;
    }

    const debounceCheck = checkDebounce(state.lastAttempt, AUTH_CONFIG.TIMING.DEBOUNCE_MS);
    if (!debounceCheck.canProceed) {
      updateState({ message: debounceCheck.message || "" });
      return;
    }

    // Verifica se há muitas tentativas recentes do mesmo email
    const emailAttempts = localStorage.getItem(`clerk_attempts_${state.email}`);
    const attempts = emailAttempts ? JSON.parse(emailAttempts) : [];
    const now = Date.now();

    // Remove tentativas antigas (mais de 1 hora)
    const recentAttempts = attempts.filter((time: number) => now - time < 3600000);

    if (recentAttempts.length >= 5) {
      updateState({
        message: "Muitas tentativas para este email. Tente novamente em 1 hora ou use outro email.",
        status: "error"
      });
      return;
    }

    updateState({
      isLoading: true,
      message: "",
      status: "loading",
    });

    try {
      if (isSignUpRoute) {
        // Se estamos na rota /sign-up, força criação de conta
        try {
          await sendEmailForSignUp(state.email);

          // Salva tentativa no localStorage
          recentAttempts.push(now);
          localStorage.setItem(`clerk_attempts_${state.email}`, JSON.stringify(recentAttempts));

          updateState({
            codeSent: true,
            isSignUpFlow: true,
            message: "Conta criada! Código de verificação enviado para seu email.",
            lastAttempt: now,
            status: "code-sent",
          });
        } catch (signUpError: unknown) {
          // Se o usuário já existe, redireciona para sign-in
          if (getClerkErrorCode(signUpError) === "form_identifier_exists") {
            updateState({
              message: "Esta conta já existe. Redirecionando para o login...",
              status: "error",
              isLoading: true, // Mostra loading durante redirecionamento
            });

            // Redireciona após 2 segundos para o usuário ver a mensagem
            setTimeout(() => {
              router.push("/sign-in");
            }, 2000);
            return;
          }
          throw signUpError;
        }
      } else {
        // Se estamos na rota /sign-in, tenta login primeiro
        await sendEmailForSignIn(state.email);

        // Salva tentativa no localStorage
        recentAttempts.push(now);
        localStorage.setItem(`clerk_attempts_${state.email}`, JSON.stringify(recentAttempts));

        // Sempre mostra tela de código para sign-in
        updateState({
          codeSent: true,
          isSignUpFlow: false,
          message: "Código de verificação enviado para seu email!",
          lastAttempt: now,
          status: "code-sent",
        });
      }
    } catch (error: unknown) {
      console.log("Auth error:", error);
      console.log("Error code:", getClerkErrorCode(error));
      console.log("Is user not found:", isUserNotFoundError(error));
      console.log("Is sign up route:", isSignUpRoute);

      // Se usuário não existe e estamos no sign-in, redireciona para sign-up
      if (isUserNotFoundError(error) && !isSignUpRoute) {
        console.log("User not found detected, redirecting to sign-up");
        updateState({
          message: "Conta não encontrada. Redirecionando para criar conta...",
          status: "error",
          isLoading: true, // Mostra loading durante redirecionamento
        });

        // Redireciona após 2 segundos para o usuário ver a mensagem
        setTimeout(() => {
          router.push("/sign-up");
        }, 2000);
        return;
      }

      // Fallback: Se estamos em sign-in e há qualquer erro, pode ser usuário não encontrado
      if (!isSignUpRoute) {
        const errorMessage = parseAuthError(error);

        // Se a mensagem sugere que o usuário não existe, tenta redirecionar
        if (errorMessage.toLowerCase().includes("não") ||
            errorMessage.toLowerCase().includes("invalid") ||
            errorMessage.toLowerCase().includes("does not exist")) {
          console.log("Possible user not found, redirecting to sign-up");
          updateState({
            message: "Conta não encontrada. Redirecionando para criar conta...",
            status: "error",
            isLoading: true,
          });

          setTimeout(() => {
            router.push("/sign-up");
          }, 2000);
          return;
        }
      }

      // Outros erros
      const errorMessage = parseAuthError(error);
      updateState({
        message: errorMessage,
        status: "error",
      });

      // Se estamos em sign-in e não conseguimos detectar que é usuário não encontrado,
      // oferece opção manual após alguns segundos
      if (!isSignUpRoute) {
        setTimeout(() => {
          updateState({
            showRedirectOptions: true,
          });
        }, 3000);
      }
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.email, state.lastAttempt, sendEmailForSignIn, sendEmailForSignUp, updateState, isSignUpRoute, router]);

  const goToSignUp = useCallback(() => {
    router.push("/sign-up");
  }, [router]);

  const goToSignIn = useCallback(() => {
    router.push("/sign-in");
  }, [router]);

  const actions = {
    setEmail: useCallback((email: string) => updateState({ email }), [updateState]),
    setStatus: useCallback((status: AuthState["status"]) => updateState({ status }), [updateState]),
    setIsLoading: useCallback((isLoading: boolean) => updateState({ isLoading }), [updateState]),
    setMessage: useCallback((message: string) => updateState({ message }), [updateState]),
    setLastAttempt: useCallback((lastAttempt: number) => updateState({ lastAttempt }), [updateState]),
    setLinkSent: useCallback((linkSent: boolean) => updateState({ linkSent }), [updateState]),
    setCodeSent: useCallback((codeSent: boolean) => updateState({ codeSent }), [updateState]),
    setIsSignUpFlow: useCallback((isSignUpFlow: boolean) => updateState({ isSignUpFlow }), [updateState]),
    setVerificationCode: useCallback((verificationCode: string) => updateState({ verificationCode }), [updateState]),
    goToSignUp,
    goToSignIn,
    resetState,
  };

  return {
    state,
    actions,
    sendMagicLink: sendEmail,
    resendMagicLink: sendEmail,
    verifyCode,
    validateEmail: useCallback((email: string) => validateEmail(email, isDev), []),
  };
};