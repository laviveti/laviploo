# LaviPloo - Documentação

Documentação completa do projeto LaviPloo - plataforma de visualização de dados para API Ploomes.

## 📋 Índice

### 🔐 Autenticação
- [Migração Clerk → Better Auth](./integrations/better-auth-migration.md)
- Implementação de Magic Link
- Configuração de autenticação

### 🐳 Docker & DevOps
- [Configuração Docker + Prisma](./integrations/docker-setup.md)
- PostgreSQL automatizado
- Scripts de desenvolvimento

### 🔌 Integrações
- [API Ploomes v2](./ploomes/api-ploomes-v2-documentation.md)
- Configuração de endpoints
- Estrutura de dados

### 🎨 Interface
- [Componentes UI](./ui/)
- Design system
- Screenshots

## 🚀 Quick Start

```bash
# 1. Configurar banco de dados
pnpm db:setup

# 2. Iniciar desenvolvimento
pnpm dev

# 3. Acessar aplicação
# http://localhost:3000/login
```

## 📁 Estrutura da Documentação

```
docs/
├── README.md                    # Este arquivo
├── integrations/
│   ├── better-auth-migration.md # Migração Clerk → Better Auth
│   └── docker-setup.md         # Docker + Prisma
├── ploomes/
│   └── api-ploomes-v2-documentation.md
└── ui/
    └── sign-in.png             # Screenshots da interface
```

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 15+ (App Router)
- **Linguagem**: TypeScript
- **Autenticação**: Better Auth (Magic Link)
- **Banco de Dados**: PostgreSQL + Prisma
- **Estilização**: Tailwind CSS 4.0
- **Containerização**: Docker + Docker Compose

## 📖 Documentações Relacionadas

### Desenvolvimento
- [CLAUDE.md](../CLAUDE.md) - Instruções para o Claude
- [package.json](../package.json) - Scripts disponíveis
- [.env.example](../.env.example) - Variáveis de ambiente

### Configuração
- [docker-compose.yml](../docker-compose.yml) - Desenvolvimento
- [docker-compose.prod.yml](../docker-compose.prod.yml) - Produção
- [Dockerfile](../Dockerfile) - Imagem da aplicação

### Database
- [prisma/schema.prisma](../prisma/schema.prisma) - Schema do banco
- [prisma/seed.ts](../prisma/seed.ts) - Dados iniciais

## 🔧 Comandos Úteis

### Banco de Dados
```bash
pnpm db:setup       # Configuração inicial
pnpm db:reset       # Reset completo
pnpm db:studio      # Interface visual
pnpm db:migrate     # Nova migração
```

### Docker
```bash
pnpm db:start       # Inicia PostgreSQL
pnpm db:stop        # Para containers
pnpm db:logs        # Ver logs
```

### Desenvolvimento
```bash
pnpm dev           # Servidor de desenvolvimento
pnpm build         # Build de produção
pnpm typecheck     # Verificar TypeScript
```

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte a documentação específica em cada pasta
2. Verifique os logs: `pnpm db:logs`
3. Reset do ambiente: `pnpm db:reset`

## 📝 Histórico de Mudanças

### v2.0.0 - Migração Better Auth
- ✅ Removido Clerk completamente
- ✅ Implementado Better Auth com Magic Link
- ✅ Integração Docker + Prisma
- ✅ PostgreSQL automatizado
- ✅ Scripts de gerenciamento

### v1.0.0 - Versão Inicial
- ✅ Next.js + Clerk
- ✅ Integração Ploomes
- ✅ Design system