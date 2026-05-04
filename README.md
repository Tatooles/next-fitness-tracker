# Next Fitness Tracker

A Next.js App Router workout log for tracking workouts, exercises, exercise history, and spreadsheet exports.

## Requirements

- Node.js 24
- pnpm
- Turso/LibSQL database credentials
- Clerk authentication credentials

## Development

Use the pinned Node version, install dependencies, and start the dev server:

```bash
nvm use
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env.local` with the required local credentials. Do not commit it.

Expected database variables:

```bash
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

Expected Clerk variables are the standard Next.js Clerk keys used by `@clerk/nextjs`.

## Useful Commands

```bash
pnpm test
pnpm lint
pnpm build
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

## Project Shape

- `app/` contains App Router pages, route handlers, metadata, and loading UI.
- `components/` contains app and form UI.
- `db/` and `migrations/` contain the Drizzle schema and migrations.
- `lib/` contains shared data, route, parsing, and formatting helpers.
- `tests/` contains Vitest unit and route-handler tests.
