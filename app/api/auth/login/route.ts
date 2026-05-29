import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, createSession, verifyPassword } from "@/lib/auth";
import { fail, handleRouteError, ok } from "@/lib/api-response";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const userWithPassword = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (
      !userWithPassword ||
      !(await verifyPassword(body.password, userWithPassword.passwordHash))
    ) {
      return fail("Invalid email or password.", 401);
    }

    const user = {
      id: userWithPassword.id,
      name: userWithPassword.name,
      email: userWithPassword.email
    };
    const session = await createSession(user.id);

    return attachSessionCookie(ok({ user }) as NextResponse, session.token, session.expiresAt);
  } catch (error) {
    return handleRouteError(error);
  }
}
