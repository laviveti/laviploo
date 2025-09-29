# LaviPloo Technical Stack

## Framework & Language
- **Next.js 15+** with App Router architecture
- **TypeScript** (strict mode, no `any` types allowed)
- **React 19** with server and client components

## Styling & UI
- **Tailwind CSS 4.0** for styling
- **shadcn/ui** components (New York style)
- **Lucide React** for icons
- **Radix UI** primitives for accessibility

## Data Management
- **TanStack Query** for server state management and caching
- **Zustand** for client-side state management
- **Nuqs** for URL state management
- **TanStack Table** (Dice UI fork) for data tables

## Database & Authentication
- **PostgreSQL** via Docker containers
- **Prisma** ORM for database operations
- **Better Auth** with Magic Link authentication only

## Validation & Forms
- **Zod** for schema validation
- **React Hook Form** for form management
- **@hookform/resolvers** for Zod integration

## Development Tools
- **pnpm** as package manager
- **ESLint** for code linting
- **TypeScript** compiler for type checking
- **Docker Compose** for local development

## API Integration
- Direct integration with **Ploomes API V2**
- All external API calls through Next.js API routes
- GET-only operations with `cache: "no-cache"`
- `User-Key` header authentication

## Common Commands

### Development
```bash
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm typecheck        # Run TypeScript checks
pnpm lint             # Run ESLint
```

### Database Operations
```bash
pnpm db:setup         # Initial database setup
pnpm db:start         # Start PostgreSQL container
pnpm db:stop          # Stop all containers
pnpm db:reset         # Reset database completely
pnpm db:studio        # Open Prisma Studio
pnpm db:migrate       # Run database migrations
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed database with initial data
```

### UI Components
```bash
pnpm shadcn:add       # Add new shadcn/ui components
```

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `PLOOOMES_API_KEY` - Ploomes API authentication key
- `BETTER_AUTH_SECRET` - Authentication secret key
- `BETTER_AUTH_URL` - Application URL for auth callbacks

## API Integration Patterns
- **CRITICAL**: Only GET requests to Ploomes API
- **No Cache**: Always use `cache: "no-cache"` for fresh data
- **Authentication**: Include `User-Key: process.env.PLOOOMES_API_KEY` header
- **Validation**: Always validate inputs with Zod schemas
- **Error Handling**: Use `getErrorMessage` utility from `lib/handle-error.ts`
- **Client Consumption**: Use TanStack Query hooks for client-side data fetching

## Required Utilities
- `lib/handle-error.ts` - Centralized error handling utility (must be created)

## Development Guidelines
### Script Management
- **Default**: Remove all test scripts after development/debugging
- **Exception**: Keep only scripts essential for deploy, migration, or critical operations
- **Language**: Always create scripts in TypeScript (.ts), never JavaScript (.js)
- **Location**: Keep `scripts/` directory clean in production

### Documentation References
- Complete docs: `/docs/README.md`
- Better Auth migration: `/docs/integrations/better-auth-migration.md`
- Docker setup: `/docs/integrations/docker-setup.md`
- Ploomes API: Use MCP Context7 `API Ploomes V2` or `/docs/ploomes/api-ploomes-v2-documentation.md`