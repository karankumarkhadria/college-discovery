import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email").toLowerCase(),
  password: z.string().min(1, "Password is required")
});

export const collegeSearchSchema = z.object({
  q: z.string().trim().optional().default(""),
  state: z.string().trim().optional().default("all"),
  type: z.string().trim().optional().default("all"),
  course: z.string().trim().optional().default("all"),
  exam: z.string().trim().optional().default("all"),
  maxFees: z.coerce.number().int().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z
    .enum(["relevance", "rating", "fees-low", "placements"])
    .optional()
    .default("relevance"),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().min(6).max(24).optional().default(9)
});

export const compareSchema = z.object({
  ids: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string()).min(2).max(3))
});

export const predictorSchema = z.object({
  exam: z.string().trim().min(2),
  rank: z.coerce.number().int().positive().max(1000000),
  preferredState: z.string().trim().optional().default("all"),
  maxFees: z.coerce.number().int().positive().optional()
});

export const createReviewSchema = z.object({
  title: z.string().trim().min(4, "Review title must be at least 4 characters").max(100),
  body: z.string().trim().min(12, "Review must be at least 12 characters").max(1200),
  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5")
});
