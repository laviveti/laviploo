# LaviPloo Development Guidelines

## API Integration Rules
### Ploomes API Constraints
- **CRITICAL**: Only GET requests allowed to Ploomes API
- **No Cache**: Always use `cache: "no-cache"` for fresh data
- **Authentication**: Include `User-Key: process.env.PLOOOMES_API_KEY` header
- **Validation**: Always validate inputs with Zod schemas before API calls
- **Error Handling**: Use `getErrorMessage` utility from `lib/handle-error.ts`

### API Route Pattern
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

## Required Utilities
### Error Handler (`lib/handle-error.ts`)
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

## Script Management
### Test Scripts Policy
- **Default Behavior**: Remove all test scripts after development/debugging
- **Exceptions**: Keep only scripts essential for:
  - Deploy processes
  - Database migrations
  - Critical operations
- **Language**: Always create scripts in TypeScript (.ts), never JavaScript (.js)
- **Location**: Keep `scripts/` directory clean in production
- **Cleanup**: Remove temporary test files before final commits

### Script Examples to Remove
- `scripts/test-*.js` files
- Debug utilities
- Development-only helpers
- API testing scripts

## Client-Side Data Fetching
### TanStack Query Hooks
- All client-side API consumption through custom hooks
- Use TanStack Query for caching and state management
- Follow the pattern: `use-[entity-name].ts`

```typescript
// hooks/use-automations.ts
import { useQuery } from "@tanstack/react-query";

export function useAutomations() {
  return useQuery({
    queryKey: ["automations"],
    queryFn: async () => {
      const response = await fetch("/api/automations");
      if (!response.ok) throw new Error("Failed to fetch automations");
      return response.json();
    },
  });
}
```

## TypeScript Standards
- **Strict Mode**: No `any` types allowed
- **Type Safety**: Always define proper interfaces and types
- **Validation**: Use Zod for runtime validation
- **Error Handling**: Proper error types and handling

## Documentation References
- **Complete Documentation**: `/docs/README.md`
- **Better Auth Migration**: `/docs/integrations/better-auth-migration.md`
- **Docker Setup**: `/docs/integrations/docker-setup.md`
- **Ploomes API**: Use MCP Context7 `API Ploomes V2` or fallback to `/docs/ploomes/api-ploomes-v2-documentation.md`