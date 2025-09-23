/**
 * Tipos relacionados à autenticação
 */

export interface EmailValidationResult {
  isValid: boolean;
  message: string;
}

export interface AuthFormState {
  email: string;
  code: string;
  isLoading: boolean;
  codeSent: boolean;
  message: string;
  showRedirectOptions: boolean;
}