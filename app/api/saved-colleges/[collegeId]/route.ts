import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/auth";
import { fail, handleRouteError, ok } from "@/lib/api-response";

type RouteContext = {
  params: Promise<{
    collegeId: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    const { collegeId } = await context.params;
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true }
    });

    if (!college) {
      return fail("College not found.", 404);
    }

    await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: user.id,
          collegeId
        }
      },
      update: {},
      create: {
        userId: user.id,
        collegeId
      }
    });

    return ok({ saved: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    const { collegeId } = await context.params;

    await prisma.savedCollege.deleteMany({
      where: {
        userId: user.id,
        collegeId
      }
    });

    return ok({ saved: false });
  } catch (error) {
    return handleRouteError(error);
  }
}
