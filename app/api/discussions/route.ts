import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/auth";
import { createQuestionSchema } from "@/lib/validators";
import { handleRouteError, ok } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const collegeSlug = url.searchParams.get("collegeSlug")?.trim();
    const where: Prisma.DiscussionQuestionWhereInput = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { body: { contains: q, mode: "insensitive" } }
      ];
    }

    if (collegeSlug) {
      where.college = {
        slug: collegeSlug
      };
    }

    const questions = await prisma.discussionQuestion.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        college: {
          select: {
            id: true,
            slug: true,
            name: true,
            city: true,
            state: true
          }
        },
        answers: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: { answers: true }
        }
      },
      take: 30
    });

    return ok({ questions });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const body = createQuestionSchema.parse(await request.json());

    const question = await prisma.discussionQuestion.create({
      data: {
        title: body.title,
        body: body.body,
        tags: body.tags,
        collegeId: body.collegeId || undefined,
        userId: user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        college: {
          select: {
            id: true,
            slug: true,
            name: true
          }
        },
        answers: true,
        _count: {
          select: { answers: true }
        }
      }
    });

    return ok({ question }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
