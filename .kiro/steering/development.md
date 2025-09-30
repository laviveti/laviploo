# Diretrizes de Desenvolvimento LaviPloo

## Comunicação e Idioma
- **Idioma Principal**: Sempre iniciar conversas em português brasileiro (pt-BR)
- **Contexto Universal**: Aplicar pt-BR independente do modo (Vibe, Spec, ou qualquer outro contexto)
- **Consistência**: Manter toda comunicação em português durante toda a sessão
- **Exceções**: Código, comentários técnicos e documentação de API podem permanecer em inglês quando apropriado

## Regras de Integração de API
### Restrições da API Ploomes
- **CRÍTICO**: Apenas requisições GET permitidas para a API Ploomes
- **Sem Cache**: Sempre usar `cache: "no-cache"` para dados frescos
- **Autenticação**: Incluir header `User-Key: process.env.PLOOOMES_API_KEY`
- **Validação**: Sempre validar inputs com schemas Zod antes das chamadas de API
- **Tratamento de Erro**: Usar utilitário `getErrorMessage` de `lib/handle-error.ts`

### Padrão de Rota de API
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

## Utilitários Obrigatórios
### Manipulador de Erro (`lib/handle-error.ts`)
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

## Gerenciamento de Scripts
### Política de Scripts de Teste
- **Comportamento Padrão**: Remover todos os scripts de teste após desenvolvimento/debug
- **Exceções**: Manter apenas scripts essenciais para:
  - Processos de deploy
  - Migrações de banco de dados
  - Operações críticas
- **Linguagem**: Sempre criar scripts em TypeScript (.ts), nunca JavaScript (.js)
- **Localização**: Manter diretório `scripts/` limpo em produção
- **Limpeza**: Remover arquivos de teste temporários antes dos commits finais

### Exemplos de Scripts para Remover
- Arquivos `scripts/test-*.js`
- Utilitários de debug
- Helpers apenas para desenvolvimento
- Scripts de teste de API

## Busca de Dados Client-Side
### Hooks TanStack Query
- Todo consumo de API client-side através de hooks customizados
- Usar TanStack Query para cache e gerenciamento de estado
- Seguir o padrão: `use-[nome-entidade].ts`

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

## Organização de Componentes
### Particionamento de Componentes Complexos
- **Regra Geral**: Quando um componente ficar muito grande ou complexo, particione-o em um diretório com seu nome
- **Estrutura**: Criar diretório com o nome do componente principal e dividir em sub-componentes
- **Exemplo Prático**: `components/automations/automation-details/`
  - `automation-details-panel.tsx` - Componente principal do painel
  - `filter-conditions-display.tsx` - Sub-componente para exibir condições
- **Benefícios**: Melhora legibilidade, manutenibilidade e reutilização de código
- **Convenção**: Manter o arquivo principal com o nome do diretório + sufixo descritivo

### Estrutura de Particionamento
```
components/
├── automations/
│   ├── automation-card.tsx          # Componente simples
│   └── automation-details/          # Componente complexo particionado
│       ├── automation-details-panel.tsx
│       ├── filter-conditions-display.tsx
│       └── index.ts                 # Barrel export (opcional)
```

## Padrões de Commit
### Conventional Commits em Português
- **Formato Obrigatório**: Usar Conventional Commits sempre em português brasileiro
- **Sem Anotações de IA**: Nunca incluir menções de IA, assistente ou automação nas mensagens
- **Estrutura**: `tipo(escopo): descrição`

### Tipos de Commit Permitidos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, espaços em branco, etc.
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção, build, etc.

### Exemplos de Commits Válidos
```
feat(automations): adiciona filtro por status nas automações
fix(api): corrige validação de parâmetros na rota de integrações
docs(readme): atualiza instruções de instalação
style(components): ajusta espaçamento nos cards de automação
refactor(hooks): simplifica lógica do useAutomations
chore(deps): atualiza dependências do projeto
```

### Exemplos de Commits Inválidos
```
❌ feat: add new automation filter (AI-generated)
❌ fix: correção automática via assistente
❌ refactor: código melhorado pela IA
```

## Padrões TypeScript
- **Modo Strict**: Tipos `any` não permitidos
- **Segurança de Tipos**: Sempre definir interfaces e tipos adequados
- **Validação**: Usar Zod para validação em tempo de execução
- **Tratamento de Erro**: Tipos de erro adequados e tratamento

## Referências de Documentação
- **Documentação Completa**: `/docs/README.md`
- **Migração Better Auth**: `/docs/integrations/better-auth-migration.md`
- **Configuração Docker**: `/docs/integrations/docker-setup.md`
- **API Ploomes**: Usar MCP Context7 `API Ploomes V2` ou fallback para `/docs/ploomes/api-ploomes-v2-documentation.md`