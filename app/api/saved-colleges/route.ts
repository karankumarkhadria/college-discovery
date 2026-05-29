import { prisma } from "@/lib/prisma";
import { requireSessionUser } from "@/lib/auth";
import { handleRouteError, ok } from "@/lib/api-response";

export async function GET() {
  try {
    const user = await requireSessionUser();
    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        college: {
          include: {
            courses: {
              select: {
                name: true,
                degree: true,
                annualFee: true,
                exam: true
              },
              take: 3,
              orderBy: { annualFee: "asc" }
            }
          }
        }
      }
    });

    return ok({
      items: savedColleges.map((item) => ({
        savedAt: item.createdAt,
        ...item.college,
        isSaved: true
      }))
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
