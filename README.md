# College Discovery Platform

Full-stack internship assignment for **Role 3: Full Stack Engineer** and **Track B: College Discovery Platform**.

## Stack

- Next.js App Router, React, TypeScript, TailwindCSS
- Next.js API Routes for backend APIs
- Prisma ORM with PostgreSQL
- Custom session authentication using HTTP-only cookies

## Features

- College listing with search, filters, sorting, and pagination
- College detail pages with overview, courses, placements, and reviews
- Compare 2-3 colleges side by side
- Predictor tool based on exam and rank
- Authentication, saved colleges, and user-scoped saved data

## Local Setup

```bash
npm install
copy .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The app runs at `http://localhost:3000`.

Seeded demo login:

```text
Email: demo@student.com
Password: Password@123
```

If PostgreSQL is already installed locally, update `.env` with the correct local password. If not, use a hosted PostgreSQL URL from Neon, Railway, Render, or Supabase.

## Architecture Notes

The project uses a single Next.js codebase because it keeps deployment simple while still separating concerns:

- `app/api/*` contains backend API routes.
- `lib/*` contains shared backend utilities, validation, Prisma, auth, and formatting helpers.
- `components/*` contains reusable frontend UI and feature components.
- `prisma/schema.prisma` defines the database model.
- `prisma/seed.ts` creates realistic demo data for search, comparison, predictor, reviews, and saved colleges.

The backend is intentionally API-driven. Frontend pages call API routes instead of reading hardcoded data, so the product behaves like a real full-stack application.

Prisma client generation runs on `postinstall`; use `npm run db:generate` manually after schema changes if needed.

More explanation for interview and Loom prep:

- `docs/ARCHITECTURE.md`
- `docs/SETUP_AND_DEPLOYMENT.md`
- `docs/LOOM_SCRIPT.md`
- `docs/BEGINNER_GUIDE.md`
- `docs/SCHEMA_DIAGRAM.md`
- `docs/DATA_SOURCES.md`
