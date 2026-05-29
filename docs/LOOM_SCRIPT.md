# Loom Video Script

## 1. Intro

I chose the Full Stack Engineer role and the College Discovery Platform track. The product is a database-backed college discovery MVP with listing search, detail pages, comparison, predictor, Q&A, authentication, and saved colleges.

## 2. Tech Stack

I used Next.js, React, TypeScript, TailwindCSS, Next.js API routes, Prisma, and PostgreSQL. This matches the required stack and keeps the app deployable as one project. Next.js gives both frontend and backend routes, Prisma gives typed database access, and PostgreSQL handles relational data like colleges, courses, saved items, and discussions.

## 3. Architecture

The app is organized into `app/api` for backend routes, `components` for reusable UI, `lib` for shared utilities, and `prisma` for the schema and seed data. The frontend does not hardcode college data. It calls API routes, and the API routes query the database through Prisma.

## 4. Backend Features

The listing API supports search, filters, sorting, and pagination. The compare API accepts 2-3 college slugs and returns normalized comparison data. The predictor API accepts exam and rank, checks course closing ranks, and classifies results as reach, target, or safe. Q&A and saved colleges require authentication.

## 5. Authentication

Authentication uses bcrypt for password hashing and HTTP-only cookie sessions. The database stores only a hash of the session token. That protects passwords and reduces risk if session data is leaked.

## 6. Frontend Experience

The UI includes loading, empty, and error states. Users can search colleges, filter by state, type, exam, course, fees, and rating, then view detail pages or compare selected colleges. The saved page is user-scoped and requires login.

## 7. Tradeoffs

I used a modular monolith instead of separate frontend and backend services because it is simpler to deploy and review. Search uses Prisma filters for MVP simplicity; at larger scale I would add PostgreSQL full-text search or a dedicated search service.

## 8. Edge Cases

The APIs validate inputs with Zod. Auth-only routes return a clear 401 error. The predictor has a fallback response if no exact eligible college is found. Save college uses an upsert, so duplicate saves do not create duplicate rows.

## 9. Closing

The project is intentionally scoped as a production-oriented MVP. The architecture is simple enough to explain, but the core flows are complete and database-backed.
