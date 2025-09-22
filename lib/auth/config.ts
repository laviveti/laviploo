export const AUTH_CONFIG = {
  ROUTES: {
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-in",
    VERIFY: "/sign-in/verify",
    DASHBOARD: "/",
    AFTER_SIGN_IN: "/",
    AFTER_SIGN_UP: "/",
  },

  TIMING: {
    DEBOUNCE_MS: 10000, // 10 segundos ao invés de 3
    REDIRECT_DELAY_MS: 1000,
    VERIFICATION_DELAY_MS: 1200,
  },

  EMAIL: {
    ALLOWED_DOMAINS: {
      PRODUCTION: ['lavive.com.br'],
      DEVELOPMENT: ['lavive.com.br', 'gmail.com'],
    },
  },

  MESSAGES: {
    LOADING: {
      SENDING: "Enviando...",
      VERIFYING: "Verificando link...",
    },
    SUCCESS: {
      LINK_SENT: "Enviamos um link mágico para o seu email. Abra-o para continuar.",
      ACCOUNT_CREATED: "Criamos sua conta e enviamos um link mágico para o seu email.",
      LOGIN_COMPLETED: "Login concluído! Redirecionando...",
      VERIFIED: "Tudo certo!",
    },
    ERROR: {
      EMAIL_REQUIRED: "Por favor, insira seu email",
      INVALID_DOMAIN_PROD: "O email deve estar no domínio lavive.com.br.",
      INVALID_DOMAIN_DEV: "O email deve estar no domínio lavive.com.br ou ser Gmail (modo dev).",
      SERVICE_UNAVAILABLE_SIGNIN: "Serviço de autenticação indisponível no momento.",
      SERVICE_UNAVAILABLE_SIGNUP: "Serviço de cadastro indisponível no momento.",
      MAGIC_LINK_DISABLED: "Método de magic link não está habilitado para este usuário.",
      LINK_EXPIRED: "O link gerado expirou. Tente solicitar outro link.",
      SEND_FAILED: "Erro ao enviar link mágico.",
      CREATE_ACCOUNT_FAILED: "Erro ao criar conta. Tente novamente.",
      VERIFICATION_FAILED: "Não foi possível validar",
    },
    STATUS: {
      WAIT_SECONDS: (seconds: number) => `Aguarde ${seconds} segundos antes de tentar novamente.`,
    },
  },

  PLACEHOLDERS: {
    EMAIL_PROD: 'O e-mail deve estar no domínio "lavive.com.br"',
    EMAIL_DEV: 'E-mail "lavive.com.br" ou Gmail (modo dev)',
  },
} as const;

export const getEmailValidationRegex = (isDev: boolean) => {
  const patterns = {
    lavive: /^[^\s@]+@lavive\.com\.br$/,
    gmail: /^[^\s@]+@gmail\.com$/,
  };

  return isDev ? [patterns.lavive, patterns.gmail] : [patterns.lavive];
};

export const buildAbsoluteUrl = (pathname: string): string => {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (typeof window !== "undefined") {
    return `${window.location.origin}${normalizedPath}`;
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const baseUrl = envUrl.endsWith("/") ? envUrl.slice(0, -1) : envUrl;

  return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
};