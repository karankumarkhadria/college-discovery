# Architecture Notes

## Chosen Role And Track

- Role: Full Stack Engineer
- Track: College Discovery Platform

The app focuses on five core Track B features:

- College listing and search
- College detail page
- Compare colleges
- Predictor tool
- College reviews
- Authentication and saved colleges

## Why This Tech Stack

The assignment recommends Next.js, React, TypeScript, TailwindCSS, Node.js, Prisma, and PostgreSQL. I used that stack directly because it gives a modern full-stack architecture without splitting the project into multiple deployable services.

Next.js is useful here because it supports both frontend routes and backend API routes in one codebase. That keeps the live URL simple for reviewers while still allowing real backend APIs. React and TypeScript make the UI component-driven and safer to refactor. TailwindCSS keeps styling fast and consistent without a heavy component library. Prisma gives a clear schema, typed database access, and straightforward migrations. PostgreSQL is a reliable relational database for search filters, comparisons, reviews, and user-saved data.

## High-Level Structure

```text
app/
  api/                 Backend API routes
  colleges/[slug]/     College detail page
  compare/             Comparison workflow
  predictor/           Rank-based recommendation tool
  saved/               User saved colleges
components/            Reusable client UI components
lib/                   Prisma, auth, validation, API helpers
prisma/                Database schema and seed data
types/                 Shared TypeScript domain types
```

## Backend Design

The backend is built with Next.js API routes. Each feature has its own route group:

- `GET /api/colleges` supports search, filters, sorting, and pagination.
- `GET /api/colleges/[slug]` returns one detailed college profile.
- `GET /api/compare?ids=a,b,c` returns normalized comparison data for 2-3 colleges.
- `POST /api/predictor` matches exam and rank against course closing ranks.
- `POST /api/colleges/[slug]/reviews` lets logged-in users add college reviews.
- `GET /api/saved-colleges` returns user-scoped saved colleges.
- `POST/DELETE /api/saved-colleges/[collegeId]` saves or removes a college.
- `GET /api/health` verifies the database connection.

Validation is centralized in `lib/validators.ts` with Zod. API responses are standardized in `lib/api-response.ts`, so validation errors, auth failures, and server errors return consistent JSON.

## Database Design

Main tables:

- `User`: account identity and password hash
- `Session`: hashed session tokens with expiry
- `College`: searchable college profile data
- `Course`: course-specific fees, exam, and closing rank
- `Review`: college reviews
- `SavedCollege`: many-to-many user shortlist table

Courses are separate from colleges because admissions logic depends on course-level fields like exam and closing rank. Saved colleges are a separate join table so each user has isolated shortlist data.

## Authentication Design

Authentication uses email/password with bcrypt hashing. After login/signup, the server creates a random session token, stores only its hash in the database, and sends the raw token in an HTTP-only cookie.

Why this approach:

- Passwords are never stored in plain text.
- Session tokens are not readable by client-side JavaScript.
- If the database leaks, raw session tokens are not exposed.
- Saved colleges and review posting can be scoped to the logged-in user.

## Frontend Design

The frontend is component-driven:

- `CollegeExplorer` handles search/filter/pagination state.
- `CollegeCard` renders reusable listing cards.
- `CollegeDetail` renders overview, courses, placements, and reviews.
- `CompareWorkspace` manages 2-3 college comparison state.
- `PredictorTool` handles rank input and recommendation results.
- `SavedColleges` renders the user's shortlist.
- `AuthProvider` shares user/session state across the app.

The UI uses loading states, empty states, and error states for API-backed pages. This makes the product feel reliable even when a request fails or returns no data.

## Predictor Logic

The predictor receives:

- exam
- rank
- optional preferred state
- optional max annual fees

It checks `Course.closingRank >= userRank` for the selected exam and filters. Results are classified as:

- Reach: user rank is close to the course closing rank
- Target: user rank is moderately below the closing rank
- Safe: user rank has a larger buffer

This is intentionally simple and explainable for an MVP. A production version could add category, quota, round, gender pool, historical trends, and probability modeling.

## Tradeoffs

The app uses a modular monolith instead of separate frontend and backend repositories. This reduces deployment and review complexity while still keeping API, validation, auth, and database logic separated.

Search uses Prisma filters rather than a search engine. This is enough for an MVP dataset. At larger scale, PostgreSQL full-text search or Meilisearch/Elasticsearch would be better.

The dataset is seeded mock data. This keeps the assignment self-contained while still proving that the product is database-driven.
