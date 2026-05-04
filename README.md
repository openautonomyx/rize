# Rize - Work OS for Enterprises

Multi-tenant SaaS platform for AI work OS.

## Features

- **Multi-Tenant Architecture**: Complete tenant isolation with row-level security
- **Authentication**: Sign up/Sign in with JWT tokens (access + refresh)
- **SSO Integration**: Google OAuth
- **Agent Builder**: Build AI agents using Langflow
- **Pre-configured Agents**: Langflow, OpenHands, LibreChat, AnythingLLM, Open Notebook

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Auth**: JWT with refresh tokens

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your database URL
# DATABASE_URL=postgresql://user:pass@localhost:5432/rize
```

### Database Setup

```bash
# Generate migrations
npm run db:generate

# Push to database
npm run db:push
```

### Development

```bash
npm run dev
```

Open http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new company and user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user (authenticated)

### Users
- `GET /api/v1/users` - List users (authenticated)
- `POST /api/v1/users` - Invite user (authenticated)

### Companies
- `GET /api/v1/companies` - Get company (authenticated)
- `PATCH /api/v1/companies` - Update company (authenticated)

### Agents
- `GET /api/v1/agents` - List available agents (authenticated)

### Dashboard
- `GET /api/v1/dashboard` - Dashboard overview (authenticated)

## Architecture

The platform implements multi-tenancy with:
1. Every company gets isolated data via `companyId` foreign key
2. All API routes enforce tenant isolation
3. JWT tokens include `companyId` for request context

## License

MIT