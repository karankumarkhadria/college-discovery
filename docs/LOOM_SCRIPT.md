# Loom Video Script

Target length: 5-6 minutes.

Recommended recording order:

1. Product demo
2. Architecture overview
3. Schema diagram
4. Save-college data flow
5. Decisions, edge cases, and tradeoffs
6. Closing

## 0:00 - 0:20 Intro

Say:

> Hi, I am Karan. For this assignment I chose the Full Stack Engineer role and Track B, the College Discovery Platform. I built a full-stack college discovery MVP where students can search colleges, view college details, compare colleges, use a rank-based predictor, log in, save colleges, and post reviews.

Show:

- Home page
- Top navigation
- Mention live URL or local URL

## 0:20 - 2:20 Product Walkthrough

Show the home/search page.

Say:

> This is the main discovery page. The listings are database-backed. The frontend calls the `/api/colleges` API, and the API reads from PostgreSQL using Prisma. Users can search colleges, filter by state, type, course, exam, fees, and rating, and sort by relevance, fees, rating, or placements.

Show:

- Search `iit`
- Point out that IIT results come from the database
- Change one filter, like state or exam
- Change sort to placements or fees

Say:

> I added pagination and API-backed filters so the page can handle a larger dataset without changing the frontend structure.

Open a college detail page.

Say:

> The detail page shows overview, courses, placements, accepted exams, recruiters, and reviews. Courses are stored separately from colleges because each course can have its own exam, annual fee, and closing rank.

Show:

- Courses table
- Placement section
- Review form

Say:

> Review creation is protected. The backend checks login, validates title, body, and rating, and then recalculates the college rating and review count after saving the review.

Open Compare page.

Say:

> The compare flow supports two or three colleges side by side. I added a quick decision summary for strongest package, placement rate, rating, and lowest fees, and then a detailed table for transparent comparison.

Open Predictor page.

Say:

> The predictor accepts exam, rank, preferred state, and max fees. The backend matches the rank against course closing ranks and classifies options as Safe, Target, or Reach. It also shows rank buffer, ROI, and reasons for each recommendation, so the result is explainable.

Show:

- JEE Advanced rank `1400`
- Safe/Target/Reach cards
- "Why this match" section

Login and saved page.

Say:

> Authentication uses email and password. Passwords are hashed with bcrypt. On login, the server creates a session, stores a hash of the session token, and sends the browser an HTTP-only cookie. Saved colleges are scoped to the logged-in user.

Show:

- Login
- Save one college
- Open Saved page

Demo login:

```text
demo@student.com
Password@123
```

## 2:20 - 3:20 Architecture

Open `docs/ARCHITECTURE.md` or explain from memory.

Say:

> The project uses Next.js as a full-stack framework. Node.js is the runtime, and Next.js gives frontend routes, React pages, and backend API routes in one codebase. The main folders are `app` for pages and API routes, `components` for reusable UI, `lib` for Prisma, auth, validation, and API helpers, `prisma` for schema and seed data, and `types` for shared TypeScript types.

Say:

> The frontend does not access the database directly. The frontend calls API routes. API routes validate input with Zod, check authentication when needed, call Prisma, and Prisma queries PostgreSQL.

## 3:20 - 4:10 Schema Diagram

Open:

`docs/diagrams/schema-diagram.svg`

Say:

> This is the database schema. It has six models: User, Session, College, Course, SavedCollege, and Review. User and Session handle authentication. College stores searchable college data. Course stores course-specific data like exam, fee, seats, and closing rank. SavedCollege connects users with the colleges they save. Review stores college reviews.

Say:

> The important design decision is separating College and Course. A college can have many courses, and each course can have a different closing rank, exam, and annual fee. That is why the predictor uses Course data, not only College data.

Say:

> SavedCollege prevents duplicate saves because it records one user and one college together. So if the same user clicks Save again, the backend reuses the existing saved record.

## 4:10 - 4:45 Save College Data Flow

Open:

`docs/diagrams/save-college-flow.svg`

Say:

> When a user clicks Save, React sends a POST request to `/api/saved-colleges/:collegeId`. The backend reads the session cookie, identifies the user, and uses Prisma to create or reuse a saved-college record. The API returns `{ saved: true }`, and the UI updates immediately.

Say:

> If the user is not logged in, the API returns 401 and the frontend opens the login modal.

## 4:45 - 5:40 Decisions, Edge Cases, And Tradeoffs

Say:

> A key design decision was separating College and Course. College-level data is useful for search and comparison, but predictor logic needs course-level fields like exam and closing rank.

Say:

> I used Next.js API routes with Prisma and PostgreSQL because the project needs real APIs, relational data, authentication, and a deployable full-stack product in one codebase.

Say:

> I kept the scope focused on the main decision-making flows: search, details, compare, predictor, reviews, auth, and saved colleges. This keeps the MVP cohesive and avoids adding features that are not integrated with the core architecture.

Say:

> Edge cases handled include invalid signup data, duplicate emails, unauthenticated save and review requests, duplicate saved colleges, invalid predictor inputs, no exact predictor match, empty search results, loading states, error states, and broken college images.

Say:

> The main tradeoff is search. For this MVP, Prisma filters and PostgreSQL are enough. At larger scale, I would add PostgreSQL full-text search or a dedicated search service. Another tradeoff is seeded data. The structure supports real official cutoff, fee, and placement imports later, but the current dataset is seeded for the assignment demo.

## 5:40 - 6:00 Closing

Say:

> To summarize, this is a full-stack college discovery platform with a real PostgreSQL schema, validated APIs, authentication, user-scoped saved colleges, reviews, comparison workflows, and a rank-based predictor. The focus is on reliable end-to-end flows and clear data modeling.

End.

## Quick Demo Checklist

Before recording:

- Run `npm run dev`
- Open the app URL
- Keep this script open
- Keep diagrams open:
  - `docs/diagrams/schema-diagram.svg`
  - `docs/diagrams/save-college-flow.svg`
- Login once with the demo account if needed

## If You Need To Save Time

Skip detailed filter changes and show only:

1. Search `iit`
2. One college detail page
3. Compare page
4. Predictor page
5. Save college after login
6. Schema diagram
7. One sentence each for decisions, edge cases, and tradeoffs
