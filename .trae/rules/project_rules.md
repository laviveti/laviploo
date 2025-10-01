# LaviPloo - Regras do Projeto

## Comunicação e Idioma

- **Idioma Principal**: Sempre iniciar conversas em português brasileiro (pt-BR)
- **Contexto Universal**: Aplicar pt-BR independente do modo (Vibe, Spec, ou qualquer outro contexto)
- **Consistência**: Manter toda comunicação em português durante toda a sessão
- **Exceções**: Código, comentários técnicos e documentação de API podem permanecer em inglês quando apropriado

## Visão Geral

LaviPloo é uma plataforma de visualização de dados para a API do Ploomes, com belos componentes baseados em shadcn. O projeto foca em design responsivo, performance e integração robusta com a API do Ploomes.

### Propósito Central

- Visualizar dados do CRM Ploomes através de interfaces modernas e responsivas
- Foco no gerenciamento e monitoramento de automações
- Fornecer dashboards intuitivos para insights do CRM
- Simplificar a interação do usuário com dados da API do Ploomes

### Funcionalidades Principais

- **Dashboard de Automações**: Visualizar, filtrar e gerenciar automações do CRM
- **Gerenciamento de Integrações**: Monitorar e configurar integrações do sistema
- **Visualização de Dados**: Gráficos e estatísticas bonitas para métricas do CRM
- **Design Responsivo**: Abordagem mobile-first com otimização para desktop
- **Atualizações em Tempo Real**: Sincronização de dados ao vivo com a API do Ploomes

## Stack Tecnológica Obrigatória

### Framework e Linguagem

- **Framework**: Next.js 15+ (App Router obrigatório)
- **Linguagem**: TypeScript estrito (proibido uso de `any`)
- **Estilização**: Tailwind CSS 4.0
- **Gerenciamento de Estado**: Zustand + Nuqs
- **Cache/Dados**: TanStack Query
- **Tabelas**: TanStack Table (fork Dice UI)
- **Validação**: Zod (obrigatório para todas as APIs)
- **Formulários**: React Hook Form
- **Autenticação**: Better Auth (apenas Magic Link)

### Banco de Dados

- **Desenvolvimento**: PostgreSQL via Docker
- **Produção**: Integração direta com API Ploomes (sem banco próprio)

## Estrutura de Projeto Obrigatória

### Aliases de Importação

```typescript
// tsconfig.json / next.config.js
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/stores/*": ["./stores/*"],
      "@/types/*": ["./types/*"],
      "@/constants/*": ["./constants/*"],
      "@/validations/*": ["./validations/*"]
    }
  }
}
```

### Estrutura de Diretórios

```
app/                    # App Router do Next.js
├── (dashboard)/        # Rotas protegidas por autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── automations/    # Gerenciamento de automações
│   └── integrations/   # Configurações de integração
├── (public)/          # Rotas públicas (login, landing)
│   ├── login/         # Página de autenticação
│   └── page.tsx       # Landing page
└── api/               # API routes para integração Ploomes
    ├── automations/   # Endpoints de automações
    ├── integrations/  # Endpoints de integrações
    └── auth/          # Endpoints de autenticação

components/
├── ui/                # Componentes shadcn base
│   ├── button.tsx
│   ├── card.tsx
│   ├── table.tsx
│   └── ...
├── system/            # Componentes do sistema (layout, navegação)
│   ├── header.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
├── automations/       # Componentes específicos de automações
│   ├── automation-card/
│   ├── automation-list/
│   └── automation-filters/
└── integrations/      # Componentes de integração
    ├── integration-card/
    └── integration-status/

lib/                   # Utilitários e configurações
├── auth/              # Configuração Better Auth
│   ├── config.ts      # Configuração principal
│   └── client.ts      # Cliente de autenticação
├── handle-error.ts    # Tratamento de erros (obrigatório)
├── utils.ts           # Utilitários gerais (cn, formatters)
├── ploomes-mappings.ts # Mapeamentos da API Ploomes
└── validations.ts     # Schemas Zod compartilhados

hooks/                 # Custom hooks
├── use-automations.ts # Hook para automações
├── use-integrations.ts # Hook para integrações
└── use-auth.ts        # Hook de autenticação

stores/                # Stores Zustand
├── use-automation-store.ts # Estado de automações
├── use-integration-store.ts # Estado de integrações
└── use-ui-store.ts    # Estado da interface

types/                 # Definições TypeScript
├── automation.ts      # Tipos de automação
├── integration.ts     # Tipos de integração
├── api.ts            # Tipos de API
└── index.ts          # Exports centralizados

constants/             # Constantes do projeto
├── api.ts            # URLs e configurações de API
├── routes.ts         # Rotas da aplicação
└── ui.ts             # Constantes de UI

validations/           # Schemas Zod
├── automation.ts      # Validações de automação
├── integration.ts     # Validações de integração
└── api.ts            # Validações de API

scripts/               # Scripts de desenvolvimento
├── setup-db.ts       # Script de configuração do banco
└── seed.ts           # Script de seed (remover em produção)

docs/                  # Documentação
├── README.md          # Documentação principal
├── integrations/      # Docs de integrações
│   └── ploomes.md     # Documentação da API Ploomes
└── development/       # Docs de desenvolvimento
    ├── setup.md       # Guia de configuração
    └── deployment.md  # Guia de deploy

docker/                # Configurações Docker
├── docker-compose.yml # Compose para desenvolvimento
└── Dockerfile         # Dockerfile para produção
```

### Padrões de Arquivos

- **Páginas**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- **API Routes**: `route.ts` em pastas semânticas
- **Componentes**: `index.tsx` para componente principal, arquivos específicos para subcomponentes
- **Hooks**: `use-*.ts` com nome descritivo
- **Stores**: `use-*-store.ts` seguindo padrão Zustand
- **Tipos**: `*.ts` com exports nomeados
- **Validações**: `*.ts` com schemas Zod exportados

## Convenções de Nomenclatura

### Arquivos e Pastas

- **Formato**: kebab-case obrigatório
- **Exemplos**: `automation-card.tsx`, `user-profile.tsx`
- **API Routes**: Usar `route.ts` em pastas semânticas

### Componentes

- **Formato**: PascalCase
- **Exemplos**: `AutomationCard`, `UserProfile`

### Hooks

- **Formato**: camelCase com prefixo `use`
- **Exemplos**: `useAutomations`, `useEmailValidation`

### Stores

- **Formato**: kebab-case para arquivos, camelCase para stores
- **Exemplos**: `use-automation-store.ts` → `useAutomationStore`

## Organização de Componentes Complexos

### Particionamento Obrigatório

Quando um componente se torna complexo (>150 linhas ou múltiplas responsabilidades), deve ser particionado em subcomponentes:

```
components/
├── automation-card/
│   ├── index.tsx              # Componente principal
│   ├── automation-header.tsx  # Subcomponente do cabeçalho
│   ├── automation-body.tsx    # Subcomponente do corpo
│   └── automation-actions.tsx # Subcomponente de ações
```

### Estrutura de Componente Principal

```typescript
// components/automation-card/index.tsx
import { AutomationHeader } from "./automation-header";
import { AutomationBody } from "./automation-body";
import { AutomationActions } from "./automation-actions";

export function AutomationCard({ automation }: AutomationCardProps) {
  return (
    <div className="border rounded-md p-4">
      <AutomationHeader automation={automation} />
      <AutomationBody automation={automation} />
      <AutomationActions automation={automation} />
    </div>
  );
}
```

### Regras de Particionamento

- **Responsabilidade Única**: Cada subcomponente deve ter uma responsabilidade específica
- **Props Compartilhadas**: Passar apenas as props necessárias para cada subcomponente
- **Reutilização**: Subcomponentes devem ser reutilizáveis quando possível
- **Nomenclatura**: Usar prefixo do componente principal nos subcomponentes

## Padrões de API Obrigatórios

### Integração com Ploomes

- **CRÍTICO**: Apenas requisições GET permitidas
- **Cache**: Sempre usar `cache: "no-cache"`
- **Headers obrigatórios**:
  ```typescript
  headers: {
    'User-Key': process.env.PLOOOMES_API_KEY,
    'Content-Type': 'application/json'
  }
  ```

### Padrão de Rota de API Completo

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
        "User-Key": process.env.PLOOOMES_API_KEY!,
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

### Utilitário Obrigatório de Tratamento de Erros

**Arquivo**: `lib/handle-error.ts` (deve ser criado)

```typescript
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

export function getErrorMessage(err: unknown) {
  const unknownError = "Algo deu errado, tente novamente mais tarde.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
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

### Hooks TanStack Query (Client-side)

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

### Estrutura de API Routes

- **Client-side**: Sempre consumir via hooks TanStack Query
- **Server-side**: Todas as chamadas externas via endpoints Next.js
- **Padrão**: Endpoints em `app/api/` com validação Zod

## Paleta de Cores Oficial

### Cores Primárias

- **Rosa**: `#f43f5e` (rose-500) - Ações principais
- **Zinc**: Tons neutros - Textos e fundos
- **Purple**: `#7e22ce` - Destaques e contrastes

### Uso das Cores

- **Botões primários**: Rosa (rose-500, rose-600)
- **Textos**: Zinc (zinc-700, zinc-500, zinc-400)
- **Fundos**: Zinc (zinc-50, zinc-100, zinc-900)
- **Acentos**: Purple (purple-600, purple-700)

## Diretrizes de Design/UI

### Estilo Compacto Obrigatório

- **Spacing**: Preferir tamanhos reduzidos
  - ✅ `px-2, py-2, gap-2`
  - ❌ `px-3, py-3, gap-3`
- **Border Radius**: Preferir `rounded-md` ao invés de `rounded-lg`
- **Ícones**: Tamanho padrão `h-4 w-4`

### Responsividade

- **Obrigatório**: Design totalmente responsivo
- **Breakpoints**: Usar breakpoints padrão do Tailwind
- **Mobile-first**: Sempre começar pelo design mobile

### Componentes shadcn

- **Base**: Usar componentes shadcn como base
- **Customização**: Manter consistência com a paleta de cores
- **Acessibilidade**: Manter padrões de acessibilidade dos componentes

## Gerenciamento de Estado

### Zustand (Estado Global)

- **Uso**: Estados complexos compartilhados
- **Localização**: `stores/`
- **Padrão**: Um store por domínio

### Nuqs (URL State)

- **Uso**: Estados que devem persistir na URL
- **Exemplos**: Filtros, paginação, busca

### TanStack Query (Server State)

- **Uso**: Cache e sincronização de dados da API
- **Padrão**: Hooks customizados em `hooks/`

## Variáveis de Ambiente

### Obrigatórias

```env
PLOOOMES_API_KEY=sua_chave_aqui
```

### Desenvolvimento (Docker)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/laviploo
```

## Comandos de Desenvolvimento

### Banco de Dados

```bash
pnpm db:setup       # Configuração inicial automática
pnpm db:reset       # Reset completo do banco
pnpm db:start       # Inicia PostgreSQL
pnpm db:stop        # Para containers
pnpm db:studio      # Interface visual Prisma
pnpm db:migrate     # Nova migração
```

### Desenvolvimento

```bash
pnpm dev           # Servidor de desenvolvimento
pnpm build         # Build de produção
pnpm typecheck     # Verificar TypeScript
```

## Scripts de Teste e Limpeza

### Regras para Scripts

- **Desenvolvimento**: Scripts em `scripts/` para debugging
- **Produção**: Remover scripts temporários antes de commits
- **Linguagem**: SEMPRE TypeScript (.ts), nunca JavaScript (.js)
- **Limpeza**: Manter diretório `scripts/` limpo em produção

### Exceções

- Scripts essenciais para deploy
- Scripts de migração
- Scripts de operações críticas

## Documentação

### Localização

- **Principal**: `/docs/README.md`
- **Integrações**: `/docs/integrations/`
- **API Ploomes**: Context7 MCP ou `/docs/ploomes/`

### Manutenção

- Manter documentação atualizada
- Documentar mudanças significativas
- Incluir exemplos de uso

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
- **Validação**: Sempre validar inputs
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
test(api): adicionar testes para rotas de automação
chore(deps): atualizar dependências do projeto
perf(dashboard): otimizar carregamento de dados
ci(github): configurar workflow de deploy
```

### Regras de Commit

- **Idioma**: Sempre em português brasileiro
- **Descrição**: Máximo 50 caracteres
- **Imperativo**: Usar modo imperativo ("adicionar" não "adicionado")
- **Minúsculas**: Descrição sempre em minúsculas
- **Sem ponto**: Não terminar com ponto final
- **Escopo**: Usar quando aplicável (componente, módulo, etc.)
- **Breaking Changes**: Usar `!` após o tipo para mudanças que quebram compatibilidade

## Ferramentas de Desenvolvimento

### Obrigatórias

- **pnpm**: Gerenciador de pacotes
- **Docker**: Banco de dados local
- **Prisma**: ORM e migrations
