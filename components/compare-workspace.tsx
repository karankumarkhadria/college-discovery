"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Minus, Plus } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { formatCompactCurrency, formatPackage } from "@/lib/format";
import type { CollegeCardData, CollegeListResponse } from "@/types/domain";

export function CompareWorkspace() {
  const searchParams = useSearchParams();
  const initialIds = useMemo(
    () =>
      (searchParams.get("ids") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 3),
    [searchParams]
  );
  const [selected, setSelected] = useState<string[]>(initialIds);
  const [options, setOptions] = useState<CollegeCardData[]>([]);
  const [colleges, setColleges] = useState<CollegeCardData[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      setLoadingOptions(true);
      try {
        const data = await apiFetch<CollegeListResponse>(
          "/api/colleges?pageSize=24&sort=rating"
        );
        setOptions(data.items);
        setSelected((current) => {
          if (current.length >= 2) {
            return current;
          }

          const filled = [...current];
          for (const college of data.items) {
            if (filled.length >= 2) {
              break;
            }
            if (!filled.includes(college.slug)) {
              filled.push(college.slug);
            }
          }
          return filled;
        });
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load colleges."
        );
      } finally {
        setLoadingOptions(false);
      }
    }

    void loadOptions();
  }, []);

  useEffect(() => {
    if (selected.length < 2) {
      setColleges([]);
      return;
    }

    async function loadComparison() {
      setLoadingCompare(true);
      setError("");
      try {
        const data = await apiFetch<{ colleges: CollegeCardData[] }>(
          `/api/compare?ids=${selected.join(",")}`
        );
        setColleges(data.colleges);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to compare colleges."
        );
      } finally {
        setLoadingCompare(false);
      }
    }

    void loadComparison();
  }, [selected]);

  function toggleCollege(slug: string) {
    setSelected((current) => {
      if (current.includes(slug)) {
        return current.filter((item) => item !== slug);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, slug];
    });
  }

  return (
    <div className="section-shell py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Side-by-side decision flow
          </p>
          <h1 className="text-3xl font-bold text-ink">Compare colleges</h1>
        </div>
        <Link
          className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-muted hover:text-ink"
          href="/"
        >
          Back to search
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-lg border border-line bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-ink">Selected colleges</h2>
            <p className="text-sm text-muted">Choose 2 or 3 for comparison.</p>
          </div>

          {loadingOptions ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Loader2 className="animate-spin" size={16} />
              Loading options...
            </div>
          ) : (
            <div className="space-y-2">
              {options.map((college) => {
                const checked = selected.includes(college.slug);
                const disabled = !checked && selected.length >= 3;

                return (
                  <button
                    key={college.id}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-sm transition ${
                      checked
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-line bg-white text-ink hover:border-brand-500"
                    } ${disabled ? "opacity-45" : ""}`}
                    disabled={disabled}
                    type="button"
                    onClick={() => toggleCollege(college.slug)}
                  >
                    <span className="line-clamp-2 font-medium">
                      {college.name}
                    </span>
                    {checked ? <Minus size={16} /> : <Plus size={16} />}
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="min-w-0">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {selected.length < 2 ? (
            <div className="rounded-lg border border-line bg-white p-8 text-center">
              <h2 className="text-xl font-bold text-ink">
                Select one more college
              </h2>
              <p className="mt-2 text-sm text-muted">
                Comparison starts once at least two colleges are selected.
              </p>
            </div>
          ) : null}

          {loadingCompare ? (
            <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-line bg-white">
              <div className="flex items-center gap-3 text-muted">
                <Loader2 className="animate-spin" size={20} />
                Building comparison...
              </div>
            </div>
          ) : null}

          {!loadingCompare && colleges.length >= 2 ? (
            <div className="space-y-4">
              <DecisionSummary colleges={colleges} />

              <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
                <div className="grid border-b border-line bg-surface" style={{ gridTemplateColumns: `180px repeat(${colleges.length}, minmax(220px, 1fr))` }}>
                <div className="p-4 text-sm font-semibold text-muted">Metric</div>
                {colleges.map((college) => (
                  <div key={college.id} className="border-l border-line p-4">
                    <Link
                      className="font-bold text-ink hover:text-brand-700"
                      href={`/colleges/${college.slug}`}
                    >
                      {college.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {college.city}, {college.state}
                    </p>
                  </div>
                ))}
                </div>

                <div className="overflow-x-auto">
                  <div className="min-w-[760px]">
                    <CompareRow
                      colleges={colleges}
                      label="Fees"
                      render={(college) =>
                        `${formatCompactCurrency(college.feeMin)} - ${formatCompactCurrency(college.feeMax)}`
                      }
                    />
                    <CompareRow
                      colleges={colleges}
                      label="Average package"
                      render={(college) => formatPackage(college.averagePackage)}
                    />
                    <CompareRow
                      colleges={colleges}
                      label="Highest package"
                      render={(college) => formatPackage(college.highestPackage)}
                    />
                    <CompareRow
                      colleges={colleges}
                      label="Placement rate"
                      render={(college) => `${college.placementRate}%`}
                    />
                    <CompareRow
                      colleges={colleges}
                      label="Rating"
                      render={(college) => `${college.rating}/5 (${college.reviewCount} reviews)`}
                    />
                    <CompareRow
                      colleges={colleges}
                      label="Accepted exams"
                      render={(college) => college.examsAccepted.join(", ")}
                    />
                    <CompareRow
                      colleges={colleges}
                      label="Top courses"
                      render={(college) =>
                        college.courses
                          .map((course) => `${course.degree} ${course.name}`)
                          .join(", ")
                      }
                    />
                    <CompareRow
                      colleges={colleges}
                      label="Top recruiters"
                      render={(college) => college.topRecruiters.join(", ")}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function DecisionSummary({ colleges }: { colleges: CollegeCardData[] }) {
  const bestPackage = maxBy(colleges, (college) => college.averagePackage);
  const bestPlacement = maxBy(colleges, (college) => college.placementRate);
  const bestRating = maxBy(colleges, (college) => college.rating);
  const lowestFees = minBy(colleges, (college) => college.feeMin);

  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase text-brand-700">
          Decision summary
        </p>
        <h2 className="text-xl font-bold text-ink">
          Quick winners across key metrics
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile
          label="Best avg package"
          name={bestPackage.name}
          value={formatPackage(bestPackage.averagePackage)}
        />
        <SummaryTile
          label="Best placement rate"
          name={bestPlacement.name}
          value={`${bestPlacement.placementRate}%`}
        />
        <SummaryTile
          label="Highest rating"
          name={bestRating.name}
          value={`${bestRating.rating}/5`}
        />
        <SummaryTile
          label="Lowest fees"
          name={lowestFees.name}
          value={`${formatCompactCurrency(lowestFees.feeMin)}+`}
        />
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  name,
  value
}: {
  label: string;
  name: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink">{value}</p>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{name}</p>
    </div>
  );
}

function maxBy(
  colleges: CollegeCardData[],
  selector: (college: CollegeCardData) => number
) {
  return colleges.reduce((best, college) =>
    selector(college) > selector(best) ? college : best
  );
}

function minBy(
  colleges: CollegeCardData[],
  selector: (college: CollegeCardData) => number
) {
  return colleges.reduce((best, college) =>
    selector(college) < selector(best) ? college : best
  );
}

function CompareRow({
  label,
  colleges,
  render
}: {
  label: string;
  colleges: CollegeCardData[];
  render: (college: CollegeCardData) => string;
}) {
  return (
    <div
      className="grid border-b border-line last:border-b-0"
      style={{ gridTemplateColumns: `180px repeat(${colleges.length}, minmax(220px, 1fr))` }}
    >
      <div className="bg-surface p-4 text-sm font-semibold text-muted">
        {label}
      </div>
      {colleges.map((college) => (
        <div key={`${label}-${college.id}`} className="border-l border-line p-4 text-sm text-ink">
          {render(college)}
        </div>
      ))}
    </div>
  );
}
