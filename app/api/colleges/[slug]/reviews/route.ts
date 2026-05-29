import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/auth";
import { fail, handleRouteError, ok } from "@/lib/api-response";
import { createReviewSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = await requireSessionUser();
    const { slug } = await context.params;
    const body = createReviewSchema.parse(await request.json());

    const college = await prisma.college.findUnique({
      where: { slug },
      select: {
        id: true
      }
    });

    if (!college) {
      return fail("College not found.", 404);
    }

    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          collegeId: college.id,
          author: user.name,
          rating: body.rating,
          title: body.title,
          body: body.body
        }
      });

      const aggregate = await tx.review.aggregate({
        where: { collegeId: college.id },
        _avg: { rating: true },
        _count: { rating: true }
      });

      await tx.college.update({
        where: { id: college.id },
        data: {
          rating: Number((aggregate._avg.rating ?? body.rating).toFixed(1)),
          reviewCount: aggregate._count.rating
        }
      });

      return review;
    });

    return ok({ review: result }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
