import { AUTH_CONFIG } from "./config";
import type { AuthError, EmailValidationResult } from "./types";

export const parseAuthError = (error: unknown): string => {
  const authError = error as AuthError;
  const firstError = authError?.errors?.[0];

  return (
    firstError?.longMessage ||
    firstError?.message ||
    authError?.message ||
    AUTH_CONFIG.MESSAGES.ERROR.SEND_FAILED
  );
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
  return getClerkErrorCode(error) === "form_identifier_not_found";
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