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
- **Autenticação**: Clerk (apenas Magic Link)

## Paleta de Cores
- **Primária**: #7e22ce (purple-700)
- **Secundária**: Cores Rose (#f43f5e para contraste)
- **Uso**: Primária para ações principais, Rose para ações secundárias

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
(Adicionar comandos aqui quando descobertos durante o desenvolvimento)

## Observações
- Design totalmente responsivo obrigatório
- Uso estrito do TypeScript
- Consumo de API no client-side via hooks TanStack Query
- Todas as chamadas de API externa através de endpoints locais do Next.js
- rode comandos com pnpm