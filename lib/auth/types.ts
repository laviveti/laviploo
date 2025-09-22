export type AuthFlow = "sign-in" | "sign-up";

export type AuthStatus =
  | "idle"
  | "loading"
  | "link-sent"
  | "code-sent"
  | "verifying"
  | "verified"
  | "error";

export type VerificationStatus =
  | "loading"
  | "verified"
  | "expired"
  | "client_mismatch"
  | "failed";

export interface AuthState {
  email: string;
  status: AuthStatus;
  isLoading: boolean;
  message: string;
  lastAttempt: number;
  linkSent: boolean;
  codeSent: boolean;
  isSignUpFlow: boolean;
  verificationCode: string;
  showRedirectOptions: boolean;
}

export interface AuthActions {
  setEmail: (email: string) => void;
  setStatus: (status: AuthStatus) => void;
  setIsLoading: (loading: boolean) => void;
  setMessage: (message: string) => void;
  setLastAttempt: (timestamp: number) => void;
  setLinkSent: (sent: boolean) => void;
  setCodeSent: (sent: boolean) => void;
  setIsSignUpFlow: (isSignUp: boolean) => void;
  setVerificationCode: (code: string) => void;
  goToSignUp: () => void;
  goToSignIn: () => void;
  resetState: () => void;
}

export interface MagicLinkOptions {
  emailAddress: string;
  redirectUrl: string;
}

export interface AuthError {
  code?: string;
  message?: string;
  errors?: {
    code?: string;
    message?: string;
    longMessage?: string;
  }[];
}

export interface EmailValidationResult {
  isValid: boolean;
  message?: string;
}

export interface AuthHookReturn {
  state: AuthState;
  actions: AuthActions;
  sendMagicLink: () => Promise<void>;
  resendMagicLink: () => Promise<void>;
  verifyCode: () => Promise<void>;
  validateEmail: (email: string) => EmailValidationResult;
}

export interface VerificationCopy {
  title: string;
  description: string;
}