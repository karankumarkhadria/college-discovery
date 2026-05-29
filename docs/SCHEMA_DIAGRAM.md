# Database Schema Diagram

Open this image for the Loom video:

```text
docs/diagrams/schema-diagram.svg
```

## Simple Explanation

This schema has six models:

- `User`: stores user account details.
- `Session`: stores login sessions.
- `College`: stores college profile data.
- `Course`: stores course-level data for fees, exams, seats, and closing rank.
- `SavedCollege`: stores which user saved which college.
- `Review`: stores college reviews.

## Relationships

- One `User` can have many `Session` records.
- One `College` can have many `Course` records.
- One `College` can have many `Review` records.
- One `User` can save many colleges through `SavedCollege`.
- One `College` can be saved by many users through `SavedCollege`.
- One user can save the same college only once.

## Why Course Is Separate From College

Course data is separate because predictor logic depends on course-level values.

Example:

```text
IIT Bombay can have multiple courses.
Computer Science can have one closing rank.
Mechanical can have another closing rank.
Electrical can have another closing rank.
```

So the predictor should not only look at the college. It should look at the course, exam, and closing rank.

## Why SavedCollege Exists

Saved colleges need a separate connection model because this is a many-to-many relationship:

```text
One user can save many colleges.
One college can be saved by many users.
```

Example:

```text
Karan saved IIT Bombay
Karan saved IIT Delhi
Demo User saved IIT Bombay
```

`SavedCollege` stores these connections and prevents duplicate saves.

## Short Video Explanation

Say this:

> This schema has six models: User, Session, College, Course, SavedCollege, and Review. User and Session handle authentication. College stores college profile data. Course is separate because fees, exams, seats, and closing ranks belong to specific courses. SavedCollege connects users with the colleges they save. Review stores user reviews for colleges.
