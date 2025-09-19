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

## **Primária (Base: \#7e22ce)**

  * **Primary-50**: `#f5e8fc` → fundos bem claros
  * **Primary-100**: `#e9d0fa`
  * **Primary-200**: `#d3a9f5`
  * **Primary-300**: `#b87def`
  * **Primary-400**: `#9b4de7`
  * **Primary-500**: `#7e22ce` (base, bg-purple-700)
  * **Primary-600**: `#6c1cae`
  * **Primary-700**: `#5a188f`
  * **Primary-800**: `#47136f`
  * **Primary-900**: `#2f0c4b`

## **Rosa (rose) - Cores Secundárias (Complementares)**

  * **Rose-50**: `#fff1f2`
  * **Rose-100**: `#ffe4e6`
  * **Rose-200**: `#fecdd3`
  * **Rose-300**: `#fda4af`
  * **Rose-400**: `#fb7185`
  * **Rose-500**: `#f43f5e` (ponto de contraste)
  * **Rose-600**: `#e11d48`
  * **Rose-700**: `#be123c`
  * **Rose-800**: `#9f1239`
  * **Rose-900**: `#831843`

### 🖌️ Uso recomendado

  * **Backgrounds**
      * Neutros: `Primary-50`, `Primary-100`, `Rose-50`, `Rose-100`
      * Áreas de destaque: `Primary-500`, `Rose-500`
      * Hover: `Primary-600`, `Rose-600`
  * **Textos**
      * Em fundos claros: `Primary-700`, `Rose-700`, ou `#1a1a1a` (neutro)
      * Em fundos escuros: `Primary-50`, `Rose-50`, ou `#ffffff`
  * **Botões / CTA**
      * Primário: `bg-primary-500 text-white hover:bg-primary-600`
      * Secundário: `bg-rose-500 text-white hover:bg-rose-600`
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