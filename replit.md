# SmartSeek - AI-Powered Sourcing Platform

## Overview

SmartSeek is an AI-powered B2B sourcing intelligence platform that helps buyers and procurement professionals discover suppliers, generate sourcing reports, and calculate landed costs. The platform replaces weeks of manual supplier research with AI-driven analysis, providing professional sourcing reports, verified supplier shortlists, and accurate cost calculations.

Key features include:
- **Smart Finder**: AI-powered sourcing report generation using OpenAI
- **Supplier Shortlists**: Curated, verified supplier lists by category
- **Sourcing Tools**: Landed cost and margin calculators
- **Credit System**: Freemium model with credits for report generation
- **Role-based Access**: Buyer, seller, and admin roles with different permissions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - TanStack React Query for server state
  - Zustand for client-side state persistence
- **Styling**: Tailwind CSS v4 with shadcn/ui components (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API under `/api/*` prefix
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)

### Authentication
- **Provider**: Replit Auth via OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions with 1-week TTL
- **User Management**: Automatic user profile creation on first login
- **Route Protection**: Middleware-based authentication checks

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for validation
- **Schema Location**: `shared/schema.ts` with models in `shared/models/`
- **Migrations**: Drizzle Kit with `db:push` command

### AI Integration
- **Provider**: OpenAI via Replit AI Integrations
- **Features**: 
  - Report generation with structured JSON output
  - Image generation capability (gpt-image-1)
  - Chat functionality with conversation persistence
- **Batch Processing**: Built-in rate limiting and retry logic for bulk AI operations

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui based)
│   ├── pages/           # Route pages
│   ├── lib/             # Utilities, API client, hooks
│   └── hooks/           # Custom React hooks
├── server/              # Express backend
│   ├── replit_integrations/  # Auth, chat, image, batch modules
│   ├── services/        # Business logic (report generation)
│   └── routes.ts        # API route definitions
├── shared/              # Shared types and schemas
│   ├── schema.ts        # Drizzle database schemas
│   └── models/          # Domain models (auth, chat)
└── migrations/          # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary data store accessed via `DATABASE_URL` environment variable
- **Tables**: users, sessions, user_profiles, credit_transactions, reports, supplier_shortlists, sourcing_requests, conversations, messages

### AI Services
- **OpenAI API**: Accessed through Replit AI Integrations
  - Environment: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Used for sourcing report generation and image creation

### Authentication
- **Replit OIDC**: OpenID Connect provider for user authentication
  - Environment: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`

### Key NPM Dependencies
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `openai`: AI API client
- `passport` / `openid-client`: Authentication
- `express-session` / `connect-pg-simple`: Session management
- `zod` / `drizzle-zod`: Schema validation