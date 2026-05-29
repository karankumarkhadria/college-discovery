import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { attachSessionCookie, createSession, hashPassword } from "@/lib/auth";
import { fail, handleRouteError, ok } from "@/lib/api-response";
import { signupSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = signupSchema.parse(await request.json());
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return fail("An account with this email already exists.", 409);
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash: await hashPassword(body.password)
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    const session = await createSession(user.id);
    return attachSessionCookie(ok({ user }) as NextResponse, session.token, session.expiresAt);
  } catch (error) {
    return handleRouteError(error);
  }
}
