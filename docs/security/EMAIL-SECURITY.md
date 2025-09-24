# Sistema de Segurança de Emails - LaviPloo

## 📋 Visão Geral

O LaviPloo implementa um sistema robusto de validação de emails com múltiplas camadas de segurança, permitindo acesso apenas para usuários autorizados com domínios específicos.

## 🎯 Regras de Acesso

### 🚀 Modo Produção
- ✅ **Permitido**: Apenas emails `@lavive.com.br`
- ❌ **Bloqueado**: Todos os outros domínios

### 🛠️ Modo Desenvolvimento
- ✅ **Permitido**: Emails `@lavive.com.br`
- ✅ **Permitido**: Emails `@gmail.com` (facilitando testes)
- ❌ **Bloqueado**: Todos os outros domínios

## 🛡️ Camadas de Segurança

### 1️⃣ **Frontend (Cliente)**
- **Arquivo**: `hooks/use-email-validation.ts`
- **Função**: Validação em tempo real no formulário
- **Benefício**: Feedback imediato para o usuário

### 2️⃣ **Backend (Servidor)**
- **Arquivo**: `lib/auth/better-auth.ts`
- **Função**: Validação antes do envio do magic link
- **Benefício**: Segurança definitiva no servidor

### 3️⃣ **Middleware**
- **Arquivo**: `middleware.ts`
- **Função**: Proteção de rotas autenticadas
- **Benefício**: Controle de acesso por sessão

## 🔧 Configuração Técnica

### Padrões Regex
```typescript
// Case insensitive para melhor UX
const patterns = {
  lavive: /^[^\s@]+@lavive\.com\.br$/i,
  gmail: /^[^\s@]+@gmail\.com$/i, // Apenas em dev
};
```

### Detecção de Ambiente
```typescript
const isDev = process.env.NODE_ENV === "development";
const patterns = getEmailValidationRegex(isDev);
```

## 📍 Arquivos Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `lib/auth/config.ts` | Configuração central e regex |
| `hooks/use-email-validation.ts` | Hook de validação frontend |
| `lib/auth/better-auth.ts` | Validação backend |
| `components/system/login-form.tsx` | Interface de login |

## 🧪 Testando o Sistema


### Casos de Teste

#### ✅ Emails Válidos
- `admin@lavive.com.br`
- `usuario@LAVIVE.COM.BR` (case insensitive)
- `test@gmail.com` (apenas em dev)
- `TEST@GMAIL.COM` (apenas em dev)

#### ❌ Emails Inválidos
- `user@outlook.com`
- `pessoa@empresa.com`
- `invalid-email`
- ` ` (email vazio)

## 💡 Fluxo de Autenticação

1. **Usuário digita email** no formulário de login
2. **Frontend valida** em tempo real com feedback visual
3. **Usuário submete** o formulário
4. **Backend valida** novamente antes de processar
5. **Se válido**, envia magic link por email
6. **Usuário clica** no link recebido
7. **Sistema autentica** e redireciona para dashboard

## 🚨 Tratamento de Erros

### Mensagens de Erro
- **Produção**: "Email deve ser do domínio @lavive.com.br"
- **Desenvolvimento**: "Email deve ser do domínio @lavive.com.br ou Gmail (modo dev)"

### Validação no Servidor
```typescript
if (!isValidEmail) {
  const errorMessage = isDev
    ? "Email deve ser do domínio @lavive.com.br ou Gmail (modo desenvolvimento)"
    : "Email deve ser do domínio @lavive.com.br";
  throw new Error(errorMessage);
}
```

## 🔄 Atualizações e Manutenção

### Adicionando Novo Domínio
1. Editar `lib/auth/config.ts`
2. Atualizar regex em `getEmailValidationRegex()`
3. Atualizar mensagens em `AUTH_CONFIG.MESSAGES`
4. Executar testes para validar

### Alterando Comportamento por Ambiente
```typescript
// Em config.ts
EMAIL: {
  ALLOWED_DOMAINS: {
    PRODUCTION: ['lavive.com.br'],
    DEVELOPMENT: ['lavive.com.br', 'gmail.com', 'novo-dominio.com'],
  },
},
```

## 🔍 Logs e Monitoramento

### Logs do Servidor
```typescript
console.log("Enviando magic link para:", email);
console.log("Validação de email:", isValidEmail);
```

### Métricas Recomendadas
- Taxa de rejeição por domínio inválido
- Tentativas de acesso não autorizado
- Tempo de resposta da validação

---

**🔐 Sistema implementado e testado com sucesso!**