# **LaviPloo: Plataforma de visualização das informações no Ploomes**

## **Visão Geral do Projeto**

O objetivo é construir uma plataforma para visualizar de forma agradável e facilitada todas as informações do Ploomes, construindo lindos componentes baseados na biblioteca shadcn. A aplicação será uma plataforma de visualização de dados que consome a API do Ploomes, focando em automações.

-----

### **Tecnologias (Stacks)**

  * **Framework:** Next.js 15+ (com App Router)
  * **Linguagem:** TypeScript
  * **Estilização:** Tailwind CSS 4.0
  * **Banco de Dados:** Não utilizarei nenhum cliente de banco de dados. As interações serão diretamente com a API do Ploomes.
  * **Gerenciamento de Estado:** Zustand, Nuqs
  * **Gerenciamento de Dados/Cache:** TanStack Query
  * **Tabelas:** TanStack Table (ramificação Dice ui)
  * **Validação de Schemas:** Zod
  * **Gerenciamento de Formulários:** React Hook Form
  * **Autenticação:** Clerk (Magic Link apenas)

-----

### **Funcionalidades e Módulos**

  * **Gerenciamento de Usuários:**
      * Controle de acesso baseado em diferentes níveis de acesso (exemplo: `Admin`, `Gestor`, `Membro`).
      * Gerenciamento de permissões de usuário para controlar o acesso a funcionalidades da plataforma.

-----

### **Design e UX**

#### 🎨 Paleta de Cores

## **Primária (Base: \#f43f5e - Rosa)**

  * **Primary-50**: `#fff1f2` → fundos bem claros
  * **Primary-100**: `#ffe4e6`
  * **Primary-200**: `#fecdd3`
  * **Primary-300**: `#fda4af`
  * **Primary-400**: `#fb7185`
  * **Primary-500**: `#f43f5e` (base, bg-rose-500)
  * **Primary-600**: `#e11d48`
  * **Primary-700**: `#be123c`
  * **Primary-800**: `#9f1239`
  * **Primary-900**: `#831843`

## **Zinc - Cores Secundárias (Neutros)**

  * **Zinc-50**: `#FAFAFA`
  * **Zinc-100**: `#F4F4F5`
  * **Zinc-200**: `#E4E4E7`
  * **Zinc-300**: `#D4D4D8`
  * **Zinc-400**: `#A1A1AA`
  * **Zinc-500**: `#71717A`
  * **Zinc-600**: `#52525B`
  * **Zinc-700**: `#3F3F46`
  * **Zinc-800**: `#27272A`
  * **Zinc-900**: `#18181B`
  * **Zinc-950**: `#09090B`

## **Purple - Cores de Acento (Complementares)**

  * **Purple-50**: `#f5e8fc`
  * **Purple-100**: `#e9d0fa`
  * **Purple-200**: `#d3a9f5`
  * **Purple-300**: `#b87def`
  * **Purple-400**: `#9b4de7`
  * **Purple-500**: `#7e22ce` (ponto de contraste)
  * **Purple-600**: `#6c1cae`
  * **Purple-700**: `#5a188f`
  * **Purple-800**: `#47136f`
  * **Purple-900**: `#2f0c4b`

### 🖌️ Uso recomendado

  * **Backgrounds**
      * Neutros: `Zinc-50`, `Zinc-100`, `Zinc-200` (fundos principais)
      * Áreas de destaque: `Primary-500` (rosa), `Purple-500` (acento)
      * Hover: `Primary-600`, `Purple-600`, `Zinc-600`
  * **Textos**
      * Em fundos claros: `Zinc-700`, `Zinc-800`, `Zinc-900` (textos principais)
      * Em fundos escuros: `Zinc-50`, `Zinc-100`, `Zinc-200`
      * Títulos e destaques: `Primary-700` (rosa), `Purple-700` (acento)
  * **Botões / CTA**
      * Primário: `bg-rose-500 text-white hover:bg-rose-600`
      * Secundário: `bg-zinc-500 text-white hover:bg-zinc-600`
      * Acento: `bg-purple-500 text-white hover:bg-purple-600`
  * **Responsividade:**
    A interface deve ser **totalmente responsiva**, garantindo uma experiência consistente em desktop, tablet e mobile.

-----

### **Padrões de Código e Arquitetura**

  * **Arquitetura:**
    Adotar uma arquitetura limpa e organizada, com estrutura de pastas seguindo o padrão **kebab-case**:

    ```bash
    - app/
    - app/api/
    - components/
    - lib/
    - constants/
    - hooks/
    - stores/ (Zustand)
    - types/
    - validations/ (Zod)
    ```

  * **Convenções de Código:**

      * **Tipagem:** Usar **TypeScript estritamente**, evitando o tipo `any`.
      * **Nomenclatura:** Pastas e arquivos devem seguir **kebab-case** (ex: `exemplo-de-arquivo.tsx`).
      * **Estrutura de Código:** As interações com a API externa devem ser feitas através de **API Endpoints** locais no Next.js, usando a API nativa `fetch` com a orientação `no-cache` para evitar problemas com CORS e garantir que os dados estejam sempre atualizados.
      * **Validação:** **Sempre** validar os inputs das API Endpoints com schemas Zod.

  * **Utilidades:**

      * Criar em `lib` o arquivo `handle-error.ts` para centralizar o tratamento de erros:

    <!-- end list -->

    ```typescript
    import { isRedirectError } from "next/dist/client/components/redirect-error";
    import { z } from "zod";

    export function getErrorMessage(err: unknown) {
      const unknownError = "Something went wrong, please try again later.";

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

  * **API Endpoints (apenas GET):**

      * **AVISO:** Devido a restrições da API externa do Ploomes, a aplicação usará **apenas o método `GET`** , passando os parâmetros necessários via URL.
      * Nomear arquivos de forma semântica (ex: `route.ts` dentro de pastas de rotas, como `app/api/users/route.ts`).
      * Construir todas as operações dentro do arquivo semântico.
      * Começar iniciando um `try...catch` retornando a resposta em formato `JSON` no `try` e lançar uma resposta de erro no `catch` usando a função `getErrorMessage`.

    <!-- end list -->

    ```typescript
    // app/api/ploomes/deals/route.ts

    import { NextRequest, NextResponse } from "next/server";
    import { getErrorMessage } from "@/lib/handle-error";
    import { z } from "zod";

    // Schema de validação para os parâmetros da URL
    const dealSchema = z.object({
      stageId: z.string(),
      ownerId: z.string(),
    });

    export async function GET(req: NextRequest) {
      try {
        const { searchParams } = new URL(req.url);
        
        // Validação dos parâmetros da URL
        const validatedParams = dealSchema.safeParse({
          stageId: searchParams.get("stageId"),
          ownerId: searchParams.get("ownerId"),
        });

        if (!validatedParams.success) {
          return new NextResponse(getErrorMessage(validatedParams.error), { status: 400 });
        }

        const { stageId, ownerId } = validatedParams.data;
        
        // Constrói a URL da API externa do Ploomes
        const ploomesApiUrl = new URL("https://api2.ploomes.com/Deals");
        ploomesApiUrl.searchParams.append("stageId", stageId);
        ploomesApiUrl.searchParams.append("ownerId", ownerId);
        
        // Faz a requisição usando fetch com o método GET e o header User-Key
        const response = await fetch(ploomesApiUrl.toString(), {
          method: "GET",
          cache: "no-cache", // Garante que os dados são sempre frescos
          headers: {
            "Content-Type": "application/json",
            "User-Key": process.env.PLOOOMES_API_KEY!, // Chave da API nos headers
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao consultar a API do Ploomes");
        }

        const data = await response.json();
        
        // Retorna a resposta da API em formato JSON
        return NextResponse.json(data);
      } catch (error) {
        // Trata e retorna o erro de forma segura
        return new NextResponse(getErrorMessage(error), { status: 500 });
      }
    }
    ```

  * **Hooks:**

      * Criar hooks baseados em **TanStack Query** para consumir os **API Endpoints** no client-side (`use-client`).

  * **Reusabilidade:**

      * Usar o diretório `/constants/` para variáveis e valores reutilizáveis, como strings e URLs de API.