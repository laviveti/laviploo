"use client";

import { useCallback, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { AUTH_CONFIG, buildAbsoluteUrl } from "@/lib/auth/config";
import {
  parseAuthError,
  parseSignUpError,
  isUserNotFoundError,
  validateEmail,
  checkDebounce,
} from "@/lib/auth/errors";
import type { AuthState, AuthHookReturn } from "@/lib/auth/types";

const isDev = process.env.NODE_ENV === "development";

export const useEmailAuth = (): AuthHookReturn => {
  const router = useRouter();
  const { signIn, isLoaded: isSignInLoaded, setActive } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

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
      console.log("Supported factors:", signInAttempt.supportedFirstFactors);

      // Tenta encontrar o fator de email_link
      const emailLinkFactor = signInAttempt.supportedFirstFactors?.find(
        (factor: any) => factor.strategy === "email_link"
      );

      if (!emailLinkFactor) {
        // Se não tem email_link, pode ter email_code
        const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
          (factor: any) => factor.strategy === "email_code"
        );

        if (emailCodeFactor) {
          // Usa email_code ao invés de email_link
          await signInAttempt.prepareFirstFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          return "email_code";
        }

        throw new Error("Verificação por email não está disponível para este usuário");
      }

      // Inicia o fluxo de email de verificação
      await signInAttempt.prepareFirstFactor({
        strategy: "email_link",
        emailAddressId: emailLinkFactor.emailAddressId,
        redirectUrl,
      });
      return "email_link";
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

      // Envia o email de verificação
      await signUpAttempt.prepareEmailAddressVerification({
        strategy: "email_link",
        redirectUrl,
      });
    },
    [isSignUpLoaded, signUp]
  );

  const verifyCode = useCallback(async () => {
    if (!state.verificationCode.trim()) {
      updateState({ message: "Por favor, insira o código de verificação" });
      return;
    }

    if (!isSignInLoaded || !signIn) {
      updateState({ message: "Serviço indisponível. Tente novamente." });
      return;
    }

    updateState({
      isLoading: true,
      message: "",
      status: "verifying",
    });

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: state.verificationCode,
      });

      if (signInAttempt.status === "complete") {
        await setActive?.({ session: signInAttempt.createdSessionId });
        updateState({
          status: "verified",
          message: "Login realizado com sucesso!"
        });
        router.push(AUTH_CONFIG.ROUTES.DASHBOARD);
      } else {
        updateState({
          message: "Código inválido. Tente novamente.",
          status: "error",
        });
      }
    } catch (error: unknown) {
      console.log("Verification error:", error);
      updateState({
        message: "Código inválido ou expirado. Tente novamente.",
        status: "error",
      });
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.verificationCode, isSignInLoaded, signIn, setActive, router, updateState]);

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

    updateState({
      isLoading: true,
      message: "",
      status: "loading",
    });

    const now = Date.now();

    try {
      // Primeiro tenta sign-in (para usuários existentes)
      const strategy = await sendEmailForSignIn(state.email);

      if (strategy === "email_code") {
        updateState({
          codeSent: true,
          isSignUpFlow: false,
          message: "Código de verificação enviado para seu email!",
          lastAttempt: now,
          status: "code-sent",
        });
      } else {
        updateState({
          linkSent: true,
          isSignUpFlow: false,
          message: "Link de verificação enviado para seu email!",
          lastAttempt: now,
          status: "link-sent",
        });
      }
    } catch (error: unknown) {
      console.log("Sign-in error:", error);

      // Se usuário não existe, tenta criar conta
      if (isUserNotFoundError(error)) {
        try {
          await sendEmailForSignUp(state.email);
          updateState({
            linkSent: true,
            isSignUpFlow: true,
            message: "Conta criada! Link de verificação enviado para seu email.",
            lastAttempt: now,
            status: "link-sent",
          });
        } catch (signUpError: unknown) {
          console.log("Sign-up error:", signUpError);
          updateState({
            message: parseSignUpError(signUpError),
            status: "error",
          });
        }
      } else {
        updateState({
          message: parseAuthError(error),
          status: "error",
        });
      }
    } finally {
      updateState({ isLoading: false });
    }
  }, [state.email, state.lastAttempt, sendEmailForSignIn, sendEmailForSignUp, updateState]);

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