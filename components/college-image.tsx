"use client";

import { useEffect, useState } from "react";
import {
  collegeDirectImageOverrides,
  collegeImageTitleOverrides
} from "@/lib/college-images";

type CollegeImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

export function CollegeImage({
  src,
  alt,
  className = "",
  fallbackClassName = ""
}: CollegeImageProps) {
  const [failed, setFailed] = useState(false);
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    let active = true;
    const slug = slugFromImagePath(src);

    setFailed(false);
    setResolvedSrc(src);

    if (!slug) {
      return;
    }

    const directImage = collegeDirectImageOverrides[slug];

    if (directImage) {
      setResolvedSrc(directImage);
      return;
    }

    const title =
      collegeImageTitleOverrides[slug] ?? alt.replace(/\s+campus$/i, "");

    resolveWikipediaImage(title).then((imageUrl) => {
      if (active && imageUrl) {
        setResolvedSrc(imageUrl);
      }
    });

    return () => {
      active = false;
    };
  }, [alt, src]);

  if (failed || !resolvedSrc) {
    return (
      <div
        className={`grid place-items-center bg-gradient-to-br from-brand-700 via-ink to-accent-700 p-4 text-center text-white ${fallbackClassName || className}`}
      >
        <div>
          <p className="text-xl font-bold">{initials(alt)}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/80">
            Image unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={`object-cover ${className}`}
      loading="lazy"
      src={resolvedSrc}
      onError={() => setFailed(true)}
    />
  );
}

function initials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter((word) => /^[A-Za-z]/.test(word))
      .slice(0, 4)
      .map((word) => word[0]?.toUpperCase())
    .join("") || "CD"
  );
}

function slugFromImagePath(src: string) {
  const match = src.match(/\/api\/college-images\/([^/?#]+)/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

async function resolveWikipediaImage(title: string) {
  const exact = await fetchWikipediaImage(
    new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      titles: title,
      prop: "pageimages",
      pithumbsize: "1200",
      redirects: "1"
    })
  );

  if (exact) {
    return exact;
  }

  return fetchWikipediaImage(
    new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrsearch: title,
      gsrlimit: "1",
      prop: "pageimages",
      pithumbsize: "1200",
      redirects: "1"
    })
  );
}

async function fetchWikipediaImage(params: URLSearchParams) {
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`);

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
