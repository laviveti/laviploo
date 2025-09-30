# Stack Técnico LaviPloo

## Framework e Linguagem
- **Next.js 15+** com arquitetura App Router
- **TypeScript** (modo strict, tipos `any` não permitidos)
- **React 19** com componentes server e client

## Estilização e UI
- **Tailwind CSS 4.0** para estilização
- Componentes **shadcn/ui** (estilo New York)
- **Lucide React** para ícones
- Primitivos **Radix UI** para acessibilidade

## Gerenciamento de Dados
- **TanStack Query** para gerenciamento de estado do servidor e cache
- **Zustand** para gerenciamento de estado do cliente
- **Nuqs** para gerenciamento de estado da URL
- **TanStack Table** (fork Dice UI) para tabelas de dados

## Banco de Dados e Autenticação
- **PostgreSQL** via containers Docker
- **Prisma** ORM para operações de banco de dados
- **Better Auth** apenas com autenticação Magic Link

## Validação e Formulários
- **Zod** para validação de esquemas
- **React Hook Form** para gerenciamento de formulários
- **@hookform/resolvers** para integração com Zod

## Ferramentas de Desenvolvimento
- **pnpm** como gerenciador de pacotes
- **ESLint** para linting de código
- Compilador **TypeScript** para verificação de tipos
- **Docker Compose** para desenvolvimento local

## Integração de API
- Integração direta com **API Ploomes V2**
- Todas as chamadas de API externas através de rotas Next.js API
- Operações apenas GET com `cache: "no-cache"`
- Autenticação via header `User-Key`

## Comandos Comuns

### Desenvolvimento
```bash
pnpm dev              # Iniciar servidor de desenvolvimento com Turbopack
pnpm build            # Build para produção
pnpm start            # Iniciar servidor de produção
pnpm typecheck        # Executar verificações TypeScript
pnpm lint             # Executar ESLint
```

### Operações de Banco de Dados
```bash
pnpm db:setup         # Configuração inicial do banco de dados
pnpm db:start         # Iniciar container PostgreSQL
pnpm db:stop          # Parar todos os containers
pnpm db:reset         # Resetar banco de dados completamente
pnpm db:studio        # Abrir Prisma Studio
pnpm db:migrate       # Executar migrações do banco de dados
pnpm db:generate      # Gerar cliente Prisma
pnpm db:push          # Aplicar mudanças do schema
pnpm db:seed          # Popular banco com dados iniciais
```

### Componentes UI
```bash
pnpm shadcn:add       # Adicionar novos componentes shadcn/ui
```

## Variáveis de Ambiente
- `DATABASE_URL` - String de conexão PostgreSQL
- `PLOOOMES_API_KEY` - Chave de autenticação da API Ploomes
- `BETTER_AUTH_SECRET` - Chave secreta de autenticação
- `BETTER_AUTH_URL` - URL da aplicação para callbacks de auth

## Padrões de Integração de API
- **CRÍTICO**: Apenas requisições GET para API Ploomes
- **Sem Cache**: Sempre usar `cache: "no-cache"` para dados frescos
- **Autenticação**: Incluir header `User-Key: process.env.PLOOOMES_API_KEY`
- **Validação**: Sempre validar inputs com schemas Zod
- **Tratamento de Erro**: Usar utilitário `getErrorMessage` de `lib/handle-error.ts`
- **Consumo Cliente**: Usar hooks TanStack Query para busca de dados client-side

## Utilitários Obrigatórios
- `lib/handle-error.ts` - Utilitário centralizado de tratamento de erros (deve ser criado)

## Diretrizes de Desenvolvimento
### Gerenciamento de Scripts
- **Padrão**: Remover todos os scripts de teste após desenvolvimento/debug
- **Exceção**: Manter apenas scripts essenciais para deploy, migração ou operações críticas
- **Linguagem**: Sempre criar scripts em TypeScript (.ts), nunca JavaScript (.js)
- **Localização**: Manter diretório `scripts/` limpo em produção

### Referências de Documentação
- Documentação completa: `/docs/README.md`
- Migração Better Auth: `/docs/integrations/better-auth-migration.md`
- Configuração Docker: `/docs/integrations/docker-setup.md`
- API Ploomes: Usar MCP Context7 `API Ploomes V2` ou `/docs/ploomes/api-ploomes-v2-documentation.md`