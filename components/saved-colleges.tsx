"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, Loader2, MapPin, Star } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { SaveCollegeButton } from "@/components/save-college-button";
import { CollegeImage } from "@/components/college-image";
import { apiFetch } from "@/lib/fetcher";
import { formatCompactCurrency, formatPackage } from "@/lib/format";
import type { CollegeCardData } from "@/types/domain";

type SavedCollege = CollegeCardData & {
  savedAt: string;
};

export function SavedColleges() {
  const { user, loading: authLoading, openAuth } = useAuth();
  const [items, setItems] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    async function loadSaved() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch<{ items: SavedCollege[] }>(
          "/api/saved-colleges"
        );
        setItems(data.items);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load saved colleges."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadSaved();
  }, [user]);

  if (authLoading) {
    return (
      <div className="section-shell grid min-h-[420px] place-items-center py-8">
        <div className="flex items-center gap-3 text-muted">
          <Loader2 className="animate-spin" size={20} />
          Checking account...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="section-shell py-8">
        <div className="rounded-lg border border-line bg-white p-8 text-center shadow-sm">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-brand-50 text-brand-700">
            <Bookmark size={22} />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-ink">
            Login to view saved colleges
          </h1>
          <p className="mt-2 text-sm text-muted">
            Saved colleges are scoped to the logged-in user.
          </p>
          <button
            className="focus-ring mt-5 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-ink"
            type="button"
            onClick={() => openAuth("login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            User-scoped shortlist
          </p>
          <h1 className="text-3xl font-bold text-ink">Saved colleges</h1>
        </div>
        <Link
          className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-muted hover:text-ink"
          href="/"
        >
          Search colleges
        </Link>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-line bg-white">
          <div className="flex items-center gap-3 text-muted">
            <Loader2 className="animate-spin" size={20} />
            Loading saved colleges...
          </div>
        </div>
      ) : null}

      {!loading && items.length === 0 ? (
        <div className="rounded-lg border border-line bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-ink">No saved colleges yet</h2>
          <p className="mt-2 text-sm text-muted">
            Save colleges from listing or detail pages to build a shortlist.
          </p>
        </div>
      ) : null}

      {!loading && items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((college) => (
            <article
              key={college.id}
              className="overflow-hidden rounded-lg border border-line bg-white shadow-sm"
            >
              <Link
                className="block h-36 overflow-hidden"
                href={`/colleges/${college.slug}`}
              >
                <CollegeImage
                  alt={`${college.name} campus`}
                  className="h-full w-full"
                  src={college.imageUrl}
                />
              </Link>
              <div className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      className="text-lg font-bold text-ink hover:text-brand-700"
                      href={`/colleges/${college.slug}`}
                    >
                      {college.name}
                    </Link>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                      <MapPin size={15} />
                      {college.city}, {college.state}
                    </p>
                  </div>
                  <SaveCollegeButton
                    compact
                    collegeId={college.id}
                    initialSaved
                    onChange={(saved) => {
                      if (!saved) {
                        setItems((current) =>
                          current.filter((item) => item.id !== college.id)
                        );
                      }
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <Metric label="Fees" value={`${formatCompactCurrency(college.feeMin)}+`} />
                  <Metric label="Avg pkg" value={formatPackage(college.averagePackage)} />
                  <Metric label="Rating" value={`${college.rating}/5`} />
                </div>

                <div className="flex items-center justify-between border-t border-line pt-3">
                  <span className="flex items-center gap-1 text-sm text-muted">
                    <Star size={15} />
                    Saved {new Date(college.savedAt).toLocaleDateString("en-IN")}
                  </span>
                  <Link
                    className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                    href={`/colleges/${college.slug}`}
                  >
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="truncate font-bold text-ink">{value}</p>
    </div>
  );
}
