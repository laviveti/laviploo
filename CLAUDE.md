# LaviPloo - Configuração Claude Code

## Visão Geral do Projeto
LaviPloo é uma plataforma de visualização de dados para a API do Ploomes, com belos componentes baseados em shadcn.

## Stack Tecnológica
- **Framework**: Next.js 15+ (App Router)
- **Linguagem**: TypeScript (estrito, sem `any`)
- **Estilização**: Tailwind CSS 4.0
- **Banco de Dados**: Nenhum (integração direta com API Ploomes)
- **Gerenciamento de Estado**: Zustand, Nuqs
- **Dados/Cache**: TanStack Query
- **Tabelas**: TanStack Table (fork Dice UI)
- **Validação**: Zod
- **Formulários**: React Hook Form
- **Autenticação**: Better Auth (apenas Magic Link)

## Paleta de Cores
- **Primária**: Tons de Rosa (#f43f5e, rose-500)
- **Secundária**: Tons de Zinc (neutros, para textos e fundos)
- **Acento**: Cores Purple (#7e22ce para contraste)
- **Uso**: Rosa para ações principais, Zinc para elementos neutros, Purple para destaques

## Estrutura do Projeto
```
app/
app/api/
components/
lib/
constants/
hooks/
stores/ (Zustand)
types/
validations/ (Zod)
```

## Convenções de Nomenclatura
- **Arquivos/Pastas**: kebab-case (ex: `arquivo-exemplo.tsx`)
- **Rotas da API**: Usar `route.ts` em pastas semânticas

## Padrões da API
- **IMPORTANTE**: Fazer APENAS requisições GET para a API do Ploomes
- **Sem cache**: Usar `cache: "no-cache"`
- **Headers**: Incluir `User-Key: process.env.PLOOOMES_API_KEY`
- **Validação**: Sempre validar com schemas Zod
- **Tratamento de Erro**: Usar utilitário `getErrorMessage` de `lib/handle-error.ts`

## Arquivos Principais para Criar
- `lib/handle-error.ts` - Utilitário de tratamento de erros
- Endpoints da API em `app/api/` seguindo o padrão fornecido

## Variáveis de Ambiente
- `PLOOOMES_API_KEY` - Chave de autenticação da API Ploomes

## Comandos de Desenvolvimento
```bash
# Banco de Dados
pnpm db:setup       # Configuração inicial automática
pnpm db:reset       # Reset completo do banco
pnpm db:start       # Inicia PostgreSQL
pnpm db:stop        # Para containers
pnpm db:studio      # Interface visual Prisma
pnpm db:migrate     # Nova migração

# Desenvolvimento
pnpm dev           # Servidor de desenvolvimento
pnpm build         # Build de produção
pnpm typecheck     # Verificar TypeScript
```

## Documentação
- **Documentação completa**: `/docs/README.md`
- **Migração Better Auth**: `/docs/integrations/better-auth-migration.md`
- **Setup Docker**: `/docs/integrations/docker-setup.md`
- **API Ploomes**: `/docs/ploomes/api-ploomes-v2-documentation.md`

## Observações
- Design totalmente responsivo obrigatório
- Uso estrito do TypeScript
- Consumo de API no client-side via hooks TanStack Query
- Todas as chamadas de API externa através de endpoints locais do Next.js
- Rode comandos com pnpm
- PostgreSQL via Docker (configuração automática)