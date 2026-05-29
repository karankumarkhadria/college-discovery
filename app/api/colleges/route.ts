import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { collegeSearchSchema } from "@/lib/validators";
import { handleRouteError, ok } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filters = collegeSearchSchema.parse(
      Object.fromEntries(url.searchParams.entries())
    );
    const where: Prisma.CollegeWhereInput = {};

    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q, mode: "insensitive" } },
        { city: { contains: filters.q, mode: "insensitive" } },
        { state: { contains: filters.q, mode: "insensitive" } },
        { overview: { contains: filters.q, mode: "insensitive" } }
      ];
    }

    if (filters.state !== "all") {
      where.state = filters.state;
    }

    if (filters.type !== "all") {
      where.type = filters.type;
    }

    if (filters.course !== "all") {
      where.courses = {
        some: {
          OR: [
            { name: { contains: filters.course, mode: "insensitive" } },
            { degree: { contains: filters.course, mode: "insensitive" } }
          ]
        }
      };
    }

    if (filters.exam !== "all") {
      where.examsAccepted = {
        has: filters.exam
      };
    }

    if (filters.maxFees) {
      where.feeMin = {
        lte: filters.maxFees
      };
    }

    if (filters.minRating) {
      where.rating = {
        gte: filters.minRating
      };
    }

    const orderBy = getCollegeOrder(filters.sort);
    const skip = (filters.page - 1) * filters.pageSize;

    const [
      total,
      colleges,
      stateOptions,
      typeOptions,
      examOptions,
      courseOptions
    ] = await prisma.$transaction([
      prisma.college.count({ where }),
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: filters.pageSize,
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
      }),
      prisma.college.findMany({
        distinct: ["state"],
        orderBy: { state: "asc" },
        select: { state: true }
      }),
      prisma.college.findMany({
        distinct: ["type"],
        orderBy: { type: "asc" },
        select: { type: true }
      }),
      prisma.course.findMany({
        distinct: ["exam"],
        orderBy: { exam: "asc" },
        select: { exam: true }
      }),
      prisma.course.findMany({
        distinct: ["name"],
        orderBy: { name: "asc" },
        select: { name: true }
      })
    ]);

    const user = await getSessionUser();
    const saved = user
      ? await prisma.savedCollege.findMany({
          where: {
            userId: user.id,
            collegeId: {
              in: colleges.map((college) => college.id)
            }
          },
          select: { collegeId: true }
        })
      : [];
    const savedIds = new Set(saved.map((item) => item.collegeId));

    return ok({
      items: colleges.map((college) => ({
        ...college,
        isSaved: savedIds.has(college.id)
      })),
      meta: {
        page: filters.page,
        pageSize: filters.pageSize,
        total,
        totalPages: Math.ceil(total / filters.pageSize)
      },
      filters: {
        states: stateOptions.map((item) => item.state),
        types: typeOptions.map((item) => item.type),
        exams: examOptions.map((item) => item.exam),
        courses: courseOptions.map((item) => item.name)
      }
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

function getCollegeOrder(
  sort: "relevance" | "rating" | "fees-low" | "placements"
): Prisma.CollegeOrderByWithRelationInput[] {
  if (sort === "rating") {
    return [{ rating: "desc" }, { reviewCount: "desc" }];
  }

  if (sort === "fees-low") {
    return [{ feeMin: "asc" }, { rating: "desc" }];
  }

  if (sort === "placements") {
    return [{ averagePackage: "desc" }, { placementRate: "desc" }];
  }

  return [{ rating: "desc" }, { averagePackage: "desc" }];
}
