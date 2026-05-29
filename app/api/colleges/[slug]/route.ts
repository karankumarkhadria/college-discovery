import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { fail, handleRouteError, ok } from "@/lib/api-response";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: {
          orderBy: [{ annualFee: "asc" }, { name: "asc" }]
        },
        reviews: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!college) {
      return fail("College not found.", 404);
    }

    const user = await getSessionUser();
    const saved = user
      ? await prisma.savedCollege.findUnique({
          where: {
            userId_collegeId: {
              userId: user.id,
              collegeId: college.id
            }
          }
        })
      : null;

    return ok({
      ...college,
      isSaved: Boolean(saved)
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
