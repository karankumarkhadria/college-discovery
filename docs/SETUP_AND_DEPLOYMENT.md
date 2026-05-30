# Setup And Deployment

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
copy .env.example .env
```

Update `DATABASE_URL` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/college_discovery?schema=public"
SESSION_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Generate Prisma client:

```bash
npm run db:generate
```

Push schema and seed data:

```bash
npm run db:push
npm run db:seed
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Login

After seeding:

```text
Email: demo@student.com
Password: Password@123
```

## Useful Checks

```bash
npm run typecheck
npm run build
```

Health endpoint:

```text
/api/health
```

## Deployment Plan

Recommended deployment:

- Vercel for the Next.js app
- Neon, Railway, Render, or Supabase for PostgreSQL

Deployment steps:

1. Create a PostgreSQL database.
2. Add `DATABASE_URL`, `SESSION_SECRET`, and `NEXT_PUBLIC_APP_URL` in the hosting provider.
3. Run Prisma schema push or migrations against the hosted database.
4. Run seed once for demo data.
5. Deploy the Next.js app.

For Vercel, the build command is:

```bash
npm run build
```

For Render, use this build command:

```bash
npm install && npm run render:build
```

This runs:

```bash
prisma db push --accept-data-loss
next build
```

The `--accept-data-loss` flag is needed on this project because the Q&A/discussion feature was removed from the final MVP. If an older Render database still has the old `DiscussionQuestion` and `DiscussionAnswer` tables, Prisma will refuse to drop them unless this flag is present.

Only run seed when you intentionally want to reset demo data:

```bash
npm run db:seed
```

The project runs `prisma generate` during `postinstall`, and `npm run db:generate` is available if the Prisma client needs to be regenerated manually.
