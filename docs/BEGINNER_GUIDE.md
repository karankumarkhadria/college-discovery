# Beginner Guide To This Project

This guide explains the project from zero.

## Why Next.js If You Know Node.js?

Node.js is not a frontend framework. Node.js is the JavaScript runtime that lets JavaScript run on a server or on your computer.

Next.js uses Node.js behind the scenes.

Simple difference:

| Thing | Meaning |
| --- | --- |
| Node.js | Runtime that executes JavaScript outside the browser |
| Express/NestJS | Backend frameworks that run on Node.js |
| React | Frontend library for building UI |
| Next.js | Full-stack React framework that runs frontend pages and backend API routes |

So this project still uses Node.js. The backend API routes run on Node.js through Next.js.

I chose Next.js because the assignment asks for a live working product. With Next.js, one app gives:

- frontend pages
- backend APIs
- authentication cookies
- Prisma database access
- one deployment URL
- one command: `npm run dev`

If we used plain Node.js + React separately, we would need two apps:

- React frontend on one port
- Node/Express backend on another port

That is also valid, but harder to deploy and explain for this assignment.

## Tech Stack Used

| Tech | Where Used | Why |
| --- | --- | --- |
| Next.js | Full app framework | Gives frontend pages and backend API routes |
| React | UI components | Builds pages like search, compare, predictor |
| TypeScript | Whole codebase | Catches mistakes before running |
| TailwindCSS | Styling | Fast, consistent UI styling |
| Node.js | Runtime | Runs Next.js backend/API code |
| Prisma | Database ORM | Lets code talk to PostgreSQL safely |
| PostgreSQL | Database | Stores users, colleges, courses, reviews, saved items, discussions |
| Zod | Validation | Rejects bad signup/question/review/API input |
| bcryptjs | Password hashing | Stores password hashes instead of real passwords |
| lucide-react | Icons | Search, save, user, send icons |

## What PostgreSQL Is

PostgreSQL is a database.

A database is like organized Excel sheets, but much stronger. Each "sheet" is called a table.

In this project, PostgreSQL stores:

- users
- hashed passwords
- login sessions
- colleges
- courses
- reviews
- saved colleges
- questions
- answers

The data is not stored in React files. React only displays data. Real data lives in PostgreSQL.

## What Prisma Is

Prisma is the middle layer between our TypeScript code and PostgreSQL.

Instead of writing raw SQL everywhere, we write:

```ts
prisma.college.findMany()
```

Prisma converts that into SQL and sends it to PostgreSQL.

The database structure is written in:

```text
prisma/schema.prisma
```

## What Seed Means

Seed means "put starting/demo data into the database".

When you run:

```bash
npm run db:seed
```

the file below runs:

```text
prisma/seed.ts
```

That file creates:

- demo user
- demo colleges
- demo courses
- demo reviews
- demo discussions
- demo saved colleges

Seed data is useful because a new database starts empty. Without seeding, the app would show no colleges.

## Where Signup Data Goes

Signup flow:

1. User fills name, email, password in the modal.
2. React sends data to:

```text
POST /api/auth/signup
```

3. Backend validates it with Zod.
4. Password is hashed using bcrypt.
5. User is saved in PostgreSQL `User` table.
6. A session token is created.
7. A hashed session token is saved in `Session` table.
8. Browser receives an HTTP-only cookie.

Important: the real password is never saved.

## Where Saved Colleges Go

Saved college flow:

1. User clicks Save.
2. Frontend sends:

```text
POST /api/saved-colleges/[collegeId]
```

3. Backend checks who is logged in from the cookie.
4. Backend saves one row in `SavedCollege`.

That row connects:

- one user
- one college

## How Frontend Gets Data

Example search page:

1. User types "IIT".
2. React component `CollegeExplorer` updates state.
3. It calls:

```text
GET /api/colleges?q=IIT&pageSize=9
```

4. API route queries PostgreSQL using Prisma.
5. API returns JSON.
6. React maps JSON into `CollegeCard` components.
7. Cards appear on screen.

## Why Validation Failed Happened

The backend intentionally rejects invalid input.

Examples:

- signup password must be at least 8 characters
- question title must be at least 8 characters
- question body must be at least 12 characters
- answer must be at least 6 characters
- review body must be at least 12 characters

Earlier the UI only showed "Validation failed". That was confusing. It now shows the real field error.

## Predictor Logic

The predictor checks your rank against course closing rank.

If:

```text
your rank <= closing rank
```

then you are eligible in this simplified MVP logic.

Example:

```text
Your rank: 1400
Closing rank: 1750
```

You are eligible because 1400 is better than 1750.

The new scoring:

- rank much better than closing rank = Safe, high confidence
- rank somewhat better = Target
- rank very close to closing rank = Reach
- rank worse than closing rank = fallback/reach, lower confidence

This is still simplified. A real predictor would need category, gender pool, quota, round, year, branch, and JoSAA historical data.

## Main Files To Understand

| File | Purpose |
| --- | --- |
| `prisma/schema.prisma` | Database tables and relationships |
| `prisma/seed.ts` | Starting data |
| `lib/prisma.ts` | Prisma client setup |
| `lib/auth.ts` | Password/session logic |
| `lib/validators.ts` | Input validation rules |
| `app/api/colleges/route.ts` | Search/filter/pagination API |
| `app/api/auth/signup/route.ts` | Signup API |
| `components/college-explorer.tsx` | Search page UI |
| `components/college-detail.tsx` | Detail page and review form |
| `components/discussion-board.tsx` | Q&A UI |
| `components/predictor-tool.tsx` | Predictor UI |
