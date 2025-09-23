/**
 * Hook para validação de email seguindo padrões do projeto LaviPloo
 */

import { getEmailValidationRegex } from "@/lib/auth/config";
import type { EmailValidationResult } from "@/types/auth";

const isDev = process.env.NODE_ENV === "development";

export function useEmailValidation() {
  const validateEmail = (email: string): EmailValidationResult => {
    if (!email.trim()) {
      return { isValid: false, message: "Por favor, insira seu email" };
    }

    const patterns = getEmailValidationRegex(isDev);
    const isValid = patterns.some(pattern => pattern.test(email));

    if (!isValid) {
      return {
        isValid: false,
        message: isDev
          ? "O email deve estar no domínio lavive.com.br ou ser Gmail (modo dev)"
          : "O email deve estar no domínio lavive.com.br"
      };
    }

    return { isValid: true, message: "" };
  };

  const getEmailPlaceholder = (): string => {
    return isDev
      ? "Digite seu e-mail com o domínio @lavive.com.br ou Gmail (modo dev)"
      : "Digite seu e-mail com o domínio @lavive.com.br";
  };

  return {
    validateEmail,
    getEmailPlaceholder,
  };
}