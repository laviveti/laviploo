# LaviPloo - Configuração Claude Code

## Comunicação e Idioma
- **Idioma Principal**: SEMPRE usar português brasileiro (pt-BR)
- **Contexto Universal**: Aplicar pt-BR em todos os modos e contextos
- **Consistência**: Manter toda comunicação em português durante a sessão
- **Exceções**: Código, comentários técnicos e documentação de API podem ser em inglês quando apropriado

## Visão Geral do Projeto
LaviPloo é uma plataforma de visualização de dados para a API do Ploomes, com foco em:
- Visualizar dados do CRM Ploomes através de interfaces modernas
- Gerenciar e monitorar automações
- Fornecer dashboards intuitivos para insights do CRM
- Simplificar a interação com dados da API do Ploomes

## Stack Tecnológica
- **Framework**: Next.js 15+ (App Router obrigatório)
- **Linguagem**: TypeScript estrito (proibido uso de `any`)
- **Estilização**: Tailwind CSS 4.0
- **Banco de Dados**: PostgreSQL via Docker (dev) / API Ploomes (prod)
- **Gerenciamento de Estado**: Zustand, Nuqs
- **Dados/Cache**: TanStack Query
- **Tabelas**: TanStack Table (fork Dice UI)
- **Validação**: Zod (obrigatório para todas as APIs)
- **Formulários**: React Hook Form
- **Autenticação**: Better Auth (apenas Magic Link)

## Paleta de Cores
- **Primária**: Tons de Rosa (#f43f5e, rose-500)
- **Secundária**: Tons de Zinc (neutros, para textos e fundos)
- **Acento**: Cores Purple (#7e22ce para contraste)
- **Uso**: Rosa para ações principais, Zinc para elementos neutros, Purple para destaques

## Estrutura do Projeto
```
app/                       # App Router do Next.js
├── (dashboard)/          # Rotas protegidas (dashboard, automações, integrações)
├── (public)/            # Rotas públicas (login, landing)
└── api/                 # API routes (automations, integrations, auth)

components/
├── ui/                  # Componentes shadcn base
├── system/             # Layout, navegação, header, sidebar
├── automations/        # Componentes de automações
└── integrations/       # Componentes de integração

lib/                     # Utilitários e configurações
├── auth/               # Configuração Better Auth
├── handle-error.ts     # Tratamento de erros (obrigatório)
├── utils.ts            # Utilitários gerais (cn, formatters)
└── ploomes-mappings.ts # Mapeamentos da API Ploomes

hooks/                   # Custom hooks (use-*.ts)
stores/                  # Stores Zustand (use-*-store.ts)
types/                   # Definições TypeScript
constants/               # Constantes (api.ts, routes.ts, ui.ts)
validations/             # Schemas Zod
scripts/                 # Scripts de desenvolvimento (limpar antes de commit)
docs/                    # Documentação do projeto
```

## Aliases de Importação
```typescript
"@/*": ["./src/*"]
"@/components/*": ["./components/*"]
"@/lib/*": ["./lib/*"]
"@/hooks/*": ["./hooks/*"]
"@/stores/*": ["./stores/*"]
"@/types/*": ["./types/*"]
"@/constants/*": ["./constants/*"]
"@/validations/*": ["./validations/*"]
```

## Convenções de Nomenclatura
- **Arquivos/Pastas**: kebab-case (ex: `automation-card.tsx`)
- **Componentes**: PascalCase (ex: `AutomationCard`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAutomations`)
- **Stores**: kebab-case para arquivos (ex: `use-automation-store.ts`)
- **Rotas da API**: Usar `route.ts` em pastas semânticas

## Organização de Componentes Complexos
Quando um componente ultrapassa 150 linhas ou tem múltiplas responsabilidades, particionar em subcomponentes:

```
components/automations/
├── automation-card.tsx         # Componente principal
├── automation-header.tsx       # Subcomponente do cabeçalho
├── automation-body.tsx         # Subcomponente do corpo
└── automation-actions.tsx      # Subcomponente de ações
```

**Regras**:
- **PROIBIDO**: NÃO usar `index.tsx` em componentes
- Responsabilidade única para cada subcomponente
- Passar apenas props necessárias
- Usar prefixo do componente principal nos subcomponentes
- Reutilizar quando possível

## Padrões da API
- **CRÍTICO**: Fazer APENAS requisições GET para a API do Ploomes
- **Sem cache**: Sempre usar `cache: "no-cache"`
- **Headers obrigatórios**:
  ```typescript
  headers: {
    'User-Key': process.env.PLOOMES_API_KEY,
    'Content-Type': 'application/json'
  }
  ```
- **Validação**: Sempre validar com schemas Zod
- **Tratamento de Erro**: Usar utilitário `getErrorMessage` de `lib/handle-error.ts`
- **Client-side**: Consumir via hooks TanStack Query
- **Server-side**: Todas as chamadas externas via endpoints Next.js

## Padrão de Rota de API Completo
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/handle-error";
import { z } from "zod";

const schema = z.object({
  param: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const validatedParams = schema.safeParse({
      param: searchParams.get("param"),
    });

    if (!validatedParams.success) {
      return new NextResponse(getErrorMessage(validatedParams.error), { status: 400 });
    }

    const ploomesUrl = new URL("https://api2.ploomes.com/endpoint");
    const response = await fetch(ploomesUrl.toString(), {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
        "User-Key": process.env.PLOOMES_API_KEY!,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro ao consultar a API do Ploomes");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(getErrorMessage(error), { status: 500 });
  }
}
```

## Utilitário de Tratamento de Erros (Obrigatório)
```typescript
// lib/handle-error.ts
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

export function getErrorMessage(err: unknown) {
  const unknownError = "Algo deu errado, tente novamente mais tarde.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);
    return errors.join("\n");
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (isRedirectError(err)) {
    throw err;
  }

  return unknownError;
}
```

## Hooks TanStack Query (Client-side)
```typescript
// hooks/use-automations.ts
import { useQuery } from "@tanstack/react-query";

export function useAutomations() {
  return useQuery({
    queryKey: ["automations"],
    queryFn: async () => {
      const response = await fetch("/api/automations");
      if (!response.ok) throw new Error("Falha ao buscar automações");
      return response.json();
    },
  });
}
```

## Gerenciamento de Estado

### Zustand (Estado Global)
- **Uso**: Estados complexos compartilhados entre componentes
- **Localização**: `stores/`
- **Padrão**: Um store por domínio (ex: `use-automation-store.ts`)

### Nuqs (URL State)
- **Uso**: Estados que devem persistir na URL (filtros, paginação, busca)
- **Exemplos**: Parâmetros de filtro, página atual, contexto de visualização

### TanStack Query (Server State)
- **Uso**: Cache e sincronização de dados da API
- **Padrão**: Hooks customizados em `hooks/`

## Variáveis de Ambiente
- `PLOOMES_API_KEY` - Chave de autenticação da API Ploomes
- `DATABASE_URL` - URL do PostgreSQL (apenas desenvolvimento)

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
- **API Ploomes**: MCP Context7: `API Ploomes V2` (usar `/docs/ploomes/api-ploomes-v2-documentation.md` em último caso)

## Regras de Qualidade

### TypeScript
- **Strict mode**: Obrigatório
- **No any**: Proibido uso de `any`
- **Tipos**: Definir tipos explícitos quando necessário

### Performance
- **Lazy loading**: Componentes pesados
- **Memoização**: Usar React.memo quando apropriado

### Segurança
- **API Keys**: Nunca expor no client-side
- **Validação**: Sempre validar inputs com Zod
- **HTTPS**: Obrigatório em produção

## Padrões de Commit (Conventional Commits)

### Formato Obrigatório
```
<tipo>(<escopo>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit (em português)
- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Mudanças de formatação (espaços, vírgulas, etc.)
- **refactor**: Refatoração de código (sem mudança de funcionalidade)
- **test**: Adição ou correção de testes
- **chore**: Tarefas de manutenção (build, dependências, etc.)
- **perf**: Melhorias de performance
- **ci**: Mudanças na configuração de CI/CD

### Exemplos de Commits
```bash
feat(automations): adicionar filtro por status
fix(api): corrigir validação de parâmetros do Ploomes
docs(readme): atualizar instruções de instalação
style(components): ajustar espaçamento dos cards
refactor(hooks): simplificar lógica do useAutomations
perf(dashboard): otimizar carregamento de dados
```

### Regras de Commit
- **Idioma**: SEMPRE em português brasileiro
- **Descrição**: Máximo 50 caracteres
- **Imperativo**: Usar modo imperativo ("adicionar" não "adicionado")
- **Minúsculas**: Descrição sempre em minúsculas
- **Sem ponto**: Não terminar com ponto final
- **Escopo**: Usar quando aplicável (componente, módulo, etc.)
- **Breaking Changes**: Usar `!` após o tipo para mudanças que quebram compatibilidade

## Diretrizes de Desenvolvimento

### Scripts de Teste
- **Por padrão**: Excluir todos os scripts de teste após desenvolvimento/debugging
- **Exceções**: Scripts essenciais para deploy, migração ou operações críticas
- **Localização**: Diretório `scripts/` deve permanecer limpo em produção
- **Limpeza**: Remover arquivos temporários de teste antes de commits finais
- **Linguagem**: SEMPRE criar scripts em TypeScript (.ts), nunca em JavaScript (.js)

### Preferências de Design/UI
- **Design responsivo**: Obrigatório para todos os componentes
- **Mobile-first**: Sempre começar pelo design mobile
- **Estilo compacto**: Preferência por elementos com espaçamento e arredondamento menores
- **Padding/Spacing**: Usar tamanhos reduzidos (px-2, py-2, gap-2) ao invés de (px-3, py-3, gap-3)
- **Border Radius**: Preferir `rounded-md` ao invés de `rounded-lg`
- **Ícones**: Usar tamanhos menores (h-4 w-4) para manter consistência

#### Componente Card
- **IMPORTANTE**: NÃO definir classe `rounded-[size]` ao usar o componente `Card`
- O arredondamento padrão já está configurado em `components/ui/card.tsx`
- Apenas sobrescrever `rounded-[size]` em último caso, quando absolutamente necessário
- Respeitar as configurações de padding já definidas no componente base

## Regras de Execução do Projeto

### Execução Automática
- **PROIBIDO**: Nunca executar `pnpm dev`, `npm start` ou similares automaticamente
- **Apenas sob solicitação**: Executar o projeto somente quando explicitamente solicitado
- **Confirmação**: Sempre aguardar confirmação antes de iniciar servidores ou processos longos
- **Respeito ao controle**: O usuário deve ter controle total sobre quando o projeto é executado

### Ferramentas de Automação e Testes
- **PROIBIDO**: Nunca executar Playwright, Puppeteer ou similares automaticamente
- **Apenas sob solicitação**: Usar ferramentas de automação de navegador somente quando solicitado
- **Sem permissão automática**: Não abrir navegadores, fazer capturas de tela ou interagir com páginas web sem autorização
- **Controle total**: O usuário deve ter controle completo sobre quando e como ferramentas de automação são utilizadas

### Comandos de Rede e Requisições HTTP
- **PROIBIDO**: Nunca executar `curl`, `Invoke-WebRequest`, `wget` ou similares automaticamente
- **Apenas sob solicitação**: Executar comandos de rede somente quando explicitamente solicitado
- **Sem requisições automáticas**: Não fazer requisições HTTP sem autorização expressa
- **Controle de acesso**: O usuário deve ter controle total sobre quando e quais requisições são feitas
- **Segurança**: Evitar exposição de dados sensíveis através de requisições não autorizadas