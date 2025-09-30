# Estrutura do Projeto LaviPloo

## Organização do Diretório Raiz
```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Grupo de rotas do dashboard
│   ├── (public)/          # Páginas públicas (login)
│   ├── api/               # Rotas de API
│   ├── globals.css        # Estilos globais
│   └── layout.tsx         # Layout raiz
├── components/            # Componentes React
├── lib/                   # Funções utilitárias
├── hooks/                 # Hooks React customizados
├── types/                 # Definições de tipos TypeScript
├── constants/             # Constantes da aplicação
├── stores/                # Stores de estado Zustand
├── validations/           # Schemas de validação Zod
├── prisma/                # Schema e migrações do banco de dados
├── docker/                # Arquivos de configuração Docker
├── docs/                  # Documentação do projeto
└── public/                # Assets estáticos
```

## Estrutura do Diretório App
- **Grupos de Rotas**: Usar parênteses para agrupamento lógico sem afetar a estrutura de URL
  - `(dashboard)/` - Páginas protegidas do dashboard
  - `(public)/` - Páginas públicas de autenticação
- **Rotas de API**: Todas as interações de API externas através de rotas Next.js API
  - `api/automations/` - Endpoints relacionados a automações
  - `api/integrations/` - Endpoints de gerenciamento de integrações
  - `api/filters/` - Endpoints de filtragem de dados
  - `api/auth/` - Endpoints de autenticação

## Organização de Componentes
```
components/
├── ui/                    # Componentes base shadcn/ui
├── system/                # Componentes do sistema (header, sidebar, etc.)
├── automations/           # Componentes específicos de automações
├── integrations/          # Componentes específicos de integrações
└── providers.tsx          # Wrapper de provedores de contexto
```

## Convenções de Nomenclatura
- **Arquivos e Pastas**: kebab-case (`automation-card.tsx`, `deal-stages/`)
- **Componentes**: PascalCase (`AutomationCard`)
- **Funções e Variáveis**: camelCase (`getUserData`)
- **Constantes**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Tipos e Interfaces**: PascalCase (`UserData`, `ApiResponse`)

## Padrões de Arquivo
- **Rotas de API**: `route.ts` em pastas semânticas
- **Componentes de Página**: `page.tsx` em diretórios de rota
- **Componentes de Layout**: `layout.tsx` para layouts específicos de rota
- **Arquivos de Componente**: Corresponder ao nome do componente (`automation-card.tsx` exporta `AutomationCard`)

## Aliases de Importação
```typescript
@/*           # Diretório raiz
@/components  # Diretório de componentes
@/lib         # Funções utilitárias
@/hooks       # Hooks customizados
@/types       # Definições de tipos
@/constants   # Constantes da aplicação
```

## Diretórios Principais

### `/lib`
- `handle-error.ts` - Utilitário centralizado de tratamento de erros
- `utils.ts` - Funções utilitárias gerais
- `auth.ts` - Configuração de autenticação

### `/hooks`
- Hooks React customizados usando TanStack Query
- Busca de dados client-side e gerenciamento de estado

### `/types`
- Interfaces e definições de tipos TypeScript
- Tipos de resposta de API
- Tipos de props de componentes

### `/constants`
- Endpoints de API e configuração
- Constantes da aplicação
- Valores específicos do ambiente

### `/validations`
- Schemas Zod para validação de formulários e API
- Sanitização de entrada e segurança de tipos

## Estrutura Docker
```
docker/
├── scripts/               # Scripts de configuração do banco de dados
├── postgres/             # Configuração PostgreSQL
└── docker-compose files  # Orquestração de containers
```

## Estrutura de Documentação
```
docs/
├── README.md             # Documentação principal
├── integrations/         # Guias de integração
└── ploomes/             # Documentação da API Ploomes
```