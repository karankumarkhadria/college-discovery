import { NextResponse } from "next/server";
import {
  collegeDirectImageOverrides,
  collegeImageTitleOverrides,
  fallbackCollegeSvg
} from "@/lib/college-images";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

type CacheEntry = {
  url: string | null;
  title: string;
  expiresAt: number;
};

const globalImageCache = globalThis as unknown as {
  collegeImageCache?: Map<string, CacheEntry>;
};

const imageCache =
  globalImageCache.collegeImageCache ?? new Map<string, CacheEntry>();

globalImageCache.collegeImageCache = imageCache;

const CACHE_MS = 24 * 60 * 60 * 1000;

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const directImage = collegeDirectImageOverrides[slug];

  if (directImage) {
    return imageResponse(readableTitle(slug), directImage);
  }

  const cached = imageCache.get(slug);

  if (cached && cached.expiresAt > Date.now()) {
    return imageResponse(cached.title, cached.url);
  }

  const college = await prisma.college.findUnique({
    where: { slug },
    select: {
      name: true
    }
  });
  const title = collegeImageTitleOverrides[slug] ?? college?.name ?? readableTitle(slug);
  const imageUrl = await findWikipediaImage(title);

  imageCache.set(slug, {
    url: imageUrl,
    title,
    expiresAt: Date.now() + CACHE_MS
  });

  return imageResponse(title, imageUrl);
}

function imageResponse(title: string, url: string | null) {
  if (url) {
    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
      }
    });
  }

  return new NextResponse(fallbackCollegeSvg(title), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
    }
  });
}

async function findWikipediaImage(title: string) {
  const exact = await fetchSummaryImage(title);

  if (exact) {
    return exact;
  }

  return fetchSearchImage(title);
}

async function fetchSummaryImage(title: string) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      {
        headers: {
          "User-Agent": "CollegeDiscoveryDemo/1.0"
        },
        next: {
          revalidate: 86400
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      originalimage?: { source?: string };
      thumbnail?: { source?: string };
    };

    return payload.originalimage?.source ?? payload.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function fetchSearchImage(title: string) {
  try {
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: title,
      gsrlimit: "1",
      prop: "pageimages",
      pithumbsize: "1200",
      redirects: "1"
    });
    const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: {
        "User-Agent": "CollegeDiscoveryDemo/1.0"
      },
      next: {
        revalidate: 86400
      }
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      query?: {
        pages?: Record<string, { thumbnail?: { source?: string } }>;
      };
    };
    const page = Object.values(payload.query?.pages ?? {})[0];

    return page?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

function readableTitle(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
