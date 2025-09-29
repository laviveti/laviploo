# LaviPloo Project Structure

## Root Directory Organization
```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard route group
│   ├── (public)/          # Public pages (login)
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
├── stores/                # Zustand state stores
├── validations/           # Zod validation schemas
├── prisma/                # Database schema and migrations
├── docker/                # Docker configuration files
├── docs/                  # Project documentation
└── public/                # Static assets
```

## App Directory Structure
- **Route Groups**: Use parentheses for logical grouping without affecting URL structure
  - `(dashboard)/` - Protected dashboard pages
  - `(public)/` - Public authentication pages
- **API Routes**: All external API interactions through Next.js API routes
  - `api/automations/` - Automation-related endpoints
  - `api/integrations/` - Integration management endpoints
  - `api/filters/` - Data filtering endpoints
  - `api/auth/` - Authentication endpoints

## Components Organization
```
components/
├── ui/                    # shadcn/ui base components
├── system/                # System-wide components (header, sidebar, etc.)
├── automations/           # Automation-specific components
├── integrations/          # Integration-specific components
└── providers.tsx          # Context providers wrapper
```

## Naming Conventions
- **Files & Folders**: kebab-case (`automation-card.tsx`, `deal-stages/`)
- **Components**: PascalCase (`AutomationCard`)
- **Functions & Variables**: camelCase (`getUserData`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **Types & Interfaces**: PascalCase (`UserData`, `ApiResponse`)

## File Patterns
- **API Routes**: `route.ts` in semantic folders
- **Page Components**: `page.tsx` in route directories
- **Layout Components**: `layout.tsx` for route-specific layouts
- **Component Files**: Match component name (`automation-card.tsx` exports `AutomationCard`)

## Import Aliases
```typescript
@/*           # Root directory
@/components  # Components directory
@/lib         # Utility functions
@/hooks       # Custom hooks
@/types       # Type definitions
@/constants   # Application constants
```

## Key Directories

### `/lib`
- `handle-error.ts` - Centralized error handling utility
- `utils.ts` - General utility functions
- `auth.ts` - Authentication configuration

### `/hooks`
- Custom React hooks using TanStack Query
- Client-side data fetching and state management

### `/types`
- TypeScript interfaces and type definitions
- API response types
- Component prop types

### `/constants`
- API endpoints and configuration
- Application-wide constants
- Environment-specific values

### `/validations`
- Zod schemas for form and API validation
- Input sanitization and type safety

## Docker Structure
```
docker/
├── scripts/               # Database setup scripts
├── postgres/             # PostgreSQL configuration
└── docker-compose files  # Container orchestration
```

## Documentation Structure
```
docs/
├── README.md             # Main documentation
├── integrations/         # Integration guides
└── ploomes/             # Ploomes API documentation
```