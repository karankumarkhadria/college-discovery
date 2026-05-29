import { NextResponse } from "next/server";
import { clearSessionCookie, deleteCurrentSession } from "@/lib/auth";
import { handleRouteError, ok } from "@/lib/api-response";

export async function POST() {
  try {
    await deleteCurrentSession();
    return clearSessionCookie(ok({ success: true }) as NextResponse);
  } catch (error) {
    return handleRouteError(error);
  }
}
