# Migração do Clerk para Better Auth - LaviPloo

## Resumo das Mudanças

✅ **Concluído:**
- Removido Clerk completamente
- Implementado Better Auth com Magic Link
- Migrado `/sign-in` para `/login`
- Configurado Prisma com PostgreSQL
- Criado middleware de autenticação
- Atualizado todos os componentes

## Como Testar

### 1. Configurar Banco PostgreSQL (Automático)
```bash
# 🚀 Configuração automática completa (primeira vez)
pnpm db:setup

# OU se preferir o método manual:
docker-compose up -d postgres
docker-compose up prisma-migrate
```

### 2. Scripts de Banco Disponíveis
```bash
# Configuração inicial automática
pnpm db:setup

# Resetar banco completamente (apaga todos os dados)
pnpm db:reset

# Gerenciar containers
pnpm db:start       # Inicia PostgreSQL
pnpm db:stop        # Para todos os containers
pnpm db:logs        # Ver logs do PostgreSQL

# Operações Prisma
pnpm db:studio      # Interface visual do banco
pnpm db:migrate     # Criar nova migração
pnpm db:generate    # Gerar cliente Prisma
pnpm db:push        # Sincronizar schema (dev)
pnpm db:seed        # Popular banco com dados iniciais

# Comando direto Docker
docker exec -it laviploo-postgres psql -U laviploo -d laviploo
```

### 3. Iniciar o Desenvolvimento
```bash
# Instalar dependências (se necessário)
pnpm install

# Iniciar o servidor de desenvolvimento
pnpm dev
```

### 4. Testar o Fluxo de Autenticação

1. **Acesse**: http://localhost:3000
   - Deve redirecionar automaticamente para `/login`

2. **Página de Login**: http://localhost:3000/login
   - Digite um email válido (@lavive.com.br ou @gmail.com no modo dev)
   - Clique em "Enviar Link de Acesso"

3. **Verificar Console**
   - O magic link será exibido no console do servidor
   - Copie a URL e acesse no navegador

4. **Página de Verificação**: http://localhost:3000/login/verify?token=...
   - Deve mostrar "Login realizado com sucesso"
   - Redirecionar para o dashboard

5. **Dashboard**: http://localhost:3000/
   - Deve exibir o dashboard
   - Botão "Sair" na sidebar deve funcionar

## Estrutura Nova

```
app/
├── api/auth/[...all]/route.ts     # API routes do Better Auth
├── login/                         # Nova página de login
│   ├── page.tsx
│   └── verify/page.tsx           # Verificação do magic link
└── (dashboard)/                   # Dashboard protegido

lib/auth/
├── better-auth.ts                 # Configuração do Better Auth
└── client.ts                     # Cliente do Better Auth

components/system/
├── login-form.tsx                 # Novo formulário de login
└── sidebar/system-sidebar.tsx    # Sidebar atualizada

hooks/
└── use-auth.ts                   # Hook personalizado de autenticação
```

## Variáveis de Ambiente

Certifique-se de que o `.env` está configurado:

```env
# Better Auth
BETTER_AUTH_SECRET=your-super-secret-key-here-change-in-production
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://laviploo:laviploo123@localhost:5432/laviploo?schema=public"

# Ploomes (mantido)
PLOOMES_API_URL=https://api2.ploomes.com
PLOOMES_API_KEY=...
```

## Próximos Passos

1. **Implementar Envio de Email Real**
   - Integrar com Resend, SendGrid ou similar
   - Atualizar função `sendMagicLink` em `lib/auth/better-auth.ts`

2. **Personalizar Templates de Email**
   - Criar templates bonitos para o magic link
   - Adicionar branding da LaviPloo

3. **Configurar Produção**
   - Atualizar `BETTER_AUTH_URL` para URL de produção
   - Configurar banco PostgreSQL em produção
   - Gerar `BETTER_AUTH_SECRET` seguro

## Arquivos Removidos

- `app/(public)/` - Todas as páginas antigas
- `components/system/sign-in-form.tsx`
- `components/system/sign-up-form.tsx`
- `middleware.ts` (substituído)
- Todas as referências ao Clerk