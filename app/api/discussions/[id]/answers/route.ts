import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/auth";
import { createAnswerSchema } from "@/lib/validators";
import { fail, handleRouteError, ok } from "@/lib/api-response";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    const { id } = await context.params;
    const body = createAnswerSchema.parse(await request.json());

    const question = await prisma.discussionQuestion.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!question) {
      return fail("Question not found.", 404);
    }

    const answer = await prisma.discussionAnswer.create({
      data: {
        body: body.body,
        questionId: id,
        userId: user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return ok({ answer }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
