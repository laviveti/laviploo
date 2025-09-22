import { AUTH_CONFIG } from "./config";
import type { AuthError, EmailValidationResult } from "./types";

export const parseAuthError = (error: unknown): string => {
  const authError = error as AuthError;
  const firstError = authError?.errors?.[0];

  let errorMessage = (
    firstError?.longMessage ||
    firstError?.message ||
    authError?.message ||
    AUTH_CONFIG.MESSAGES.ERROR.SEND_FAILED
  );

  // Traduz erros comuns do inglês para português
  const lowerMessage = errorMessage.toLowerCase();

  if (lowerMessage.includes("too many requests")) {
    errorMessage = "Muitas tentativas realizadas. Aguarde alguns minutos antes de tentar novamente.";
  } else if (lowerMessage.includes("rate limit")) {
    errorMessage = "Limite de tentativas excedido. Aguarde antes de tentar novamente.";
  } else if (lowerMessage.includes("invalid email")) {
    errorMessage = "Email inválido. Verifique o endereço e tente novamente.";
  } else if (lowerMessage.includes("user not found")) {
    errorMessage = "Usuário não encontrado.";
  } else if (lowerMessage.includes("network") || lowerMessage.includes("connection")) {
    errorMessage = "Problema de conexão. Verifique sua internet e tente novamente.";
  } else if (lowerMessage.includes("server error")) {
    errorMessage = "Erro no servidor. Tente novamente em alguns instantes.";
  }

  return errorMessage;
};

export const parseSignUpError = (error: unknown): string => {
  const authError = error as AuthError;
  const firstError = authError?.errors?.[0];

  return (
    firstError?.longMessage ||
    firstError?.message ||
    authError?.message ||
    AUTH_CONFIG.MESSAGES.ERROR.CREATE_ACCOUNT_FAILED
  );
};

export const getClerkErrorCode = (error: unknown): string | undefined => {
  const authError = error as AuthError;
  return authError?.errors?.[0]?.code ?? authError?.code;
};

export const isUserNotFoundError = (error: unknown): boolean => {
  const errorCode = getClerkErrorCode(error);
  const userNotFoundCodes = [
    "form_identifier_not_found",
    "identifier_not_found",
    "user_not_found",
    "form_identifier_does_not_exist",
    "identifier_does_not_exist"
  ];

  // Verifica por código de erro
  if (userNotFoundCodes.includes(errorCode || "")) {
    return true;
  }

  // Verifica por mensagem de erro como fallback
  const authError = error as AuthError;
  const errorMessage = (
    authError?.errors?.[0]?.longMessage ||
    authError?.errors?.[0]?.message ||
    authError?.message ||
    ""
  ).toLowerCase();

  const userNotFoundMessages = [
    "identifier not found",
    "user not found",
    "does not exist",
    "no user found",
    "couldn't find your account"
  ];

  return userNotFoundMessages.some(msg => errorMessage.includes(msg));
};

export const validateEmail = (email: string, isDev: boolean): EmailValidationResult => {
  if (!email.trim()) {
    return {
      isValid: false,
      message: AUTH_CONFIG.MESSAGES.ERROR.EMAIL_REQUIRED,
    };
  }

  const lavivePattern = /^[^\s@]+@lavive\.com\.br$/;
  const gmailPattern = /^[^\s@]+@gmail\.com$/;

  const isValidLavive = lavivePattern.test(email);
  const isValidGmail = isDev && gmailPattern.test(email);

  if (isValidLavive || isValidGmail) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: isDev
      ? AUTH_CONFIG.MESSAGES.ERROR.INVALID_DOMAIN_DEV
      : AUTH_CONFIG.MESSAGES.ERROR.INVALID_DOMAIN_PROD,
  };
};

export const checkDebounce = (lastAttempt: number, debounceMs: number): {
  canProceed: boolean;
  message?: string;
} => {
  const now = Date.now();
  const timeSinceLastAttempt = now - lastAttempt;

  if (timeSinceLastAttempt < debounceMs) {
    const remainingSeconds = Math.ceil((debounceMs - timeSinceLastAttempt) / 1000);
    return {
      canProceed: false,
      message: AUTH_CONFIG.MESSAGES.STATUS.WAIT_SECONDS(remainingSeconds),
    };
  }

  return { canProceed: true };
};