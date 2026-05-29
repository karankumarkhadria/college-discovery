import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "@/lib/auth";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: {
        message,
        details
      }
    },
    { status }
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof AuthError) {
    return fail("Please log in to continue.", 401);
  }

  if (error instanceof ZodError) {
    return fail("Validation failed", 422, error.flatten());
  }

  console.error(error);
  return fail("Something went wrong. Please try again.", 500);
}
