/**
 * Utilitário para tratamento de erros seguindo padrões do projeto LaviPloo
 */

interface ClerkError {
  errors?: Array<{
    code?: string;
    message?: string;
    longMessage?: string;
  }>;
  message?: string;
}

/**
 * Extrai mensagem de erro de diferentes tipos de erro
 */
export function getErrorMessage(error: unknown): string {
  // Se é um erro do Clerk
  if (isClerkError(error)) {
    return getClerkErrorMessage(error);
  }

  // Se é um Error padrão
  if (error instanceof Error) {
    return error.message;
  }

  // Se é uma string
  if (typeof error === "string") {
    return error;
  }

  // Fallback
  return "Erro inesperado. Tente novamente.";
}

/**
 * Verifica se o erro é do Clerk
 */
function isClerkError(error: unknown): error is ClerkError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("errors" in error || "message" in error)
  );
}

/**
 * Extrai mensagem específica de erros do Clerk
 */
function getClerkErrorMessage(error: ClerkError): string {
  // Prioriza a primeira mensagem do array de erros
  if (error.errors?.[0]) {
    const firstError = error.errors[0];

    // Usa longMessage se disponível, senão message
    const message = firstError.longMessage || firstError.message;

    if (message) {
      return translateClerkError(message, firstError.code);
    }
  }

  // Fallback para message do erro principal
  if (error.message) {
    return translateClerkError(error.message);
  }

  return "Erro de autenticação. Tente novamente.";
}

/**
 * Traduz mensagens de erro do Clerk para português
 */
function translateClerkError(message: string, code?: string): string {
  const lowerMessage = message.toLowerCase();

  // Mapeamento por código específico
  if (code) {
    switch (code) {
      case "form_identifier_not_found":
        return "O usuário não existe, crie uma conta para continuar";
      case "form_identifier_exists":
        return "Esta conta já existe. Redirecionando para o login...";
      case "verification_expired":
        return "Código expirado. Solicite um novo código.";
      case "verification_failed":
        return "Código inválido. Verifique e tente novamente.";
    }
  }

  // Mapeamento por conteúdo da mensagem
  if (lowerMessage.includes("invalid code") || lowerMessage.includes("verification failed")) {
    return "Código inválido. Verifique e tente novamente.";
  }

  if (lowerMessage.includes("expired")) {
    return "Código expirado. Solicite um novo código.";
  }

  if (lowerMessage.includes("too many requests") || lowerMessage.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
  }

  if (lowerMessage.includes("blocked")) {
    return "Conta temporariamente bloqueada. Entre em contato com o administrador.";
  }

  if (lowerMessage.includes("identifier_not_found")) {
    return "O usuário não existe, crie uma conta para continuar";
  }

  if (lowerMessage.includes("identifier_exists")) {
    return "Esta conta já existe. Redirecionando para o login...";
  }

  // Retorna a mensagem original se não há tradução específica
  return message;
}

/**
 * Determina se uma mensagem deve ser exibida como sucesso ou erro
 */
export function getMessageType(message: string): "success" | "error" {
  const lowerMessage = message.toLowerCase();

  const successKeywords = [
    "enviado",
    "sucesso",
    "criada",
    "realizado",
    "completo",
    "verificado",
    "confirmado"
  ];

  const hasSuccessKeyword = successKeywords.some(keyword =>
    lowerMessage.includes(keyword)
  );

  return hasSuccessKeyword ? "success" : "error";
}

/**
 * Retorna a classe CSS apropriada para o tipo de mensagem
 */
export function getMessageClassName(message: string): string {
  const type = getMessageType(message);
  return type === "success" ? "text-green-600" : "text-red-600";
}