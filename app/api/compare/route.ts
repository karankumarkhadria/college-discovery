import { prisma } from "@/lib/prisma";
import { compareSchema } from "@/lib/validators";
import { fail, handleRouteError, ok } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const { ids } = compareSchema.parse({
      ids: url.searchParams.get("ids") ?? ""
    });

    const colleges = await prisma.college.findMany({
      where: {
        slug: {
          in: ids
        }
      },
      include: {
        courses: {
          orderBy: { annualFee: "asc" },
          take: 3
        }
      }
    });

    const orderedColleges = ids
      .map((id) => colleges.find((college) => college.slug === id))
      .filter(Boolean);

    if (orderedColleges.length < 2) {
      return fail("Select at least two valid colleges to compare.", 400);
    }

    return ok({ colleges: orderedColleges });
  } catch (error) {
    return handleRouteError(error);
  }
}
