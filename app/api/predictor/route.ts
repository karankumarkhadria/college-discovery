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
      take: 60
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
            take: 30
          });

    const source = uniqueCollegeCourses(matches.length > 0 ? matches : fallback).slice(0, 12);
    const recommendations = source.map((course) => {
      const score = scorePrediction(input.rank, course.closingRank, matches.length === 0);
      const roiScore = Number(
        (course.college.averagePackage / Math.max(course.annualFee / 100000, 1)).toFixed(1)
      );
      const rankGap = course.closingRank - input.rank;

      return {
        bucket: score.bucket,
        confidence: score.confidence,
        rankGap,
        roiScore,
        reasons: buildReasons({
          rank: input.rank,
          closingRank: course.closingRank,
          averagePackage: course.college.averagePackage,
          placementRate: course.college.placementRate,
          annualFee: course.annualFee,
          fallback: matches.length === 0
        }),
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
    });
    const summary = summarizeRecommendations(recommendations);

    return ok({
      exam: input.exam,
      rank: input.rank,
      usedFallback: matches.length === 0,
      summary,
      recommendations
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

type PredictionBucket = "Reach" | "Target" | "Safe";

type PredictionScore = {
  bucket: PredictionBucket;
  confidence: number;
};

function scorePrediction(
  rank: number,
  closingRank: number,
  fallback: boolean
): PredictionScore {
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

type RecommendationForSummary = {
  bucket: PredictionBucket;
  confidence: number;
  roiScore: number;
  college: {
    name: string;
    averagePackage: number;
    placementRate: number;
  };
};

function uniqueCollegeCourses<T extends { collegeId: string }>(courses: T[]) {
  const seenCollegeIds = new Set<string>();

  return courses.filter((course) => {
    if (seenCollegeIds.has(course.collegeId)) {
      return false;
    }

    seenCollegeIds.add(course.collegeId);
    return true;
  });
}

function summarizeRecommendations(recommendations: RecommendationForSummary[]) {
  const counts = {
    Safe: recommendations.filter((item) => item.bucket === "Safe").length,
    Target: recommendations.filter((item) => item.bucket === "Target").length,
    Reach: recommendations.filter((item) => item.bucket === "Reach").length
  };

  return {
    counts,
    bestFit: recommendations[0]?.college.name ?? null,
    strongestPlacement:
      maxBy(recommendations, (item) => item.college.placementRate)?.college.name ?? null,
    bestPackage:
      maxBy(recommendations, (item) => item.college.averagePackage)?.college.name ?? null,
    bestRoi: maxBy(recommendations, (item) => item.roiScore)?.college.name ?? null
  };
}

function buildReasons({
  rank,
  closingRank,
  averagePackage,
  placementRate,
  annualFee,
  fallback
}: {
  rank: number;
  closingRank: number;
  averagePackage: number;
  placementRate: number;
  annualFee: number;
  fallback: boolean;
}) {
  const reasons = [];
  const gap = closingRank - rank;

  if (fallback) {
    reasons.push("No exact eligible match was found, so this is a nearby option for the selected exam.");
  } else if (gap >= 0) {
    reasons.push(`Rank buffer of ${gap.toLocaleString("en-IN")} against the closing rank.`);
  }

  if (placementRate >= 85) {
    reasons.push(`Strong placement rate of ${placementRate}%.`);
  }

  if (averagePackage >= 15) {
    reasons.push(`High average package of ${averagePackage} LPA.`);
  }

  if (annualFee <= 200000) {
    reasons.push("Lower annual fee improves value for money.");
  }

  return reasons.slice(0, 3);
}

function maxBy<T>(items: T[], selector: (item: T) => number) {
  if (items.length === 0) {
    return null;
  }

  return items.reduce((best, item) =>
    selector(item) > selector(best) ? item : best
  );
}
