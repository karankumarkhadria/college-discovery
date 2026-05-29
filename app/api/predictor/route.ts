import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { handleRouteError, ok } from "@/lib/api-response";
import { predictorSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = predictorSchema.parse(await request.json());
    const collegeWhere: Prisma.CollegeWhereInput = {};

    if (input.preferredState !== "all") {
      collegeWhere.state = input.preferredState;
    }

    if (input.maxFees) {
      collegeWhere.feeMin = {
        lte: input.maxFees
      };
    }

    const matches = await prisma.course.findMany({
      where: {
        exam: input.exam,
        closingRank: {
          gte: input.rank
        },
        college: collegeWhere
      },
      include: {
        college: true
      },
      orderBy: {
        closingRank: "asc"
      },
      take: 12
    });

    const fallback =
      matches.length > 0
        ? []
        : await prisma.course.findMany({
            where: {
              exam: input.exam,
              college: collegeWhere
            },
            include: {
              college: true
            },
            orderBy: {
              closingRank: "asc"
            },
            take: 5
          });

    const source = matches.length > 0 ? matches : fallback;

    return ok({
      exam: input.exam,
      rank: input.rank,
      usedFallback: matches.length === 0,
      recommendations: source.map((course) => {
        const score = scorePrediction(input.rank, course.closingRank, matches.length === 0);

        return {
          bucket: score.bucket,
          confidence: score.confidence,
          course: {
            id: course.id,
            name: course.name,
            degree: course.degree,
            annualFee: course.annualFee,
            closingRank: course.closingRank,
            exam: course.exam
          },
          college: {
            id: course.college.id,
            slug: course.college.slug,
            name: course.college.name,
            city: course.college.city,
            state: course.college.state,
            rating: course.college.rating,
            averagePackage: course.college.averagePackage,
            placementRate: course.college.placementRate,
            feeMin: course.college.feeMin,
            feeMax: course.college.feeMax,
            imageUrl: course.college.imageUrl
          }
        };
      })
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

function scorePrediction(rank: number, closingRank: number, fallback: boolean) {
  if (fallback || rank > closingRank) {
    return {
      bucket: "Reach",
      confidence: Math.max(
        20,
        Math.min(55, Math.round((closingRank / rank) * 55))
      )
    };
  }

  const buffer = (closingRank - rank) / closingRank;

  if (buffer >= 0.5) {
    return {
      bucket: "Safe",
      confidence: Math.min(98, Math.round(88 + buffer * 14))
    };
  }

  if (buffer >= 0.18) {
    return {
      bucket: "Target",
      confidence: Math.round(72 + buffer * 30)
    };
  }

  return {
    bucket: "Reach",
    confidence: Math.round(58 + buffer * 65)
  };
}
