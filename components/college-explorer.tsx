"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Filter, Loader2, Search, X } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import type { CollegeCardData, CollegeListResponse } from "@/types/domain";
import { CollegeCard } from "@/components/college-card";

const defaultFilters = {
  q: "",
  state: "all",
  type: "all",
  course: "all",
  exam: "all",
  maxFees: "",
  minRating: "",
  sort: "relevance",
  page: 1
};

type FilterState = typeof defaultFilters;

export function CollegeExplorer() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [response, setResponse] = useState<CollegeListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CollegeCardData[]>([]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, String(value));
      }
    });
    params.set("pageSize", filters.q ? "24" : "9");
    return params.toString();
  }, [filters]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const data = await apiFetch<CollegeListResponse>(
          `/api/colleges?${queryString}`,
          { signal: controller.signal }
        );
        setResponse(data);
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load colleges."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [queryString]);

  function updateFilter<Key extends keyof FilterState>(
    key: Key,
    value: FilterState[Key]
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? Number(value) : 1
    }));
  }

  function toggleCompare(college: CollegeCardData) {
    setSelected((current) => {
      if (current.some((item) => item.id === college.id)) {
        return current.filter((item) => item.id !== college.id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, college];
    });
  }

  const compareHref =
    selected.length >= 2
      ? `/compare?ids=${selected.map((college) => college.slug).join(",")}`
      : "/compare";

  return (
    <div className="section-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit min-w-0 rounded-lg border border-line bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-brand-700">
                Discovery filters
              </p>
              <h1 className="text-2xl font-bold text-ink">Find colleges</h1>
            </div>
            <Filter className="text-brand-700" size={20} />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-ink">
              <span className="flex items-center gap-2">
                <Search className="text-muted" size={16} />
                Search
              </span>
              <input
                className="form-field mt-1 min-w-0"
                placeholder="College, city, program"
                value={filters.q}
                onChange={(event) => updateFilter("q", event.target.value)}
              />
            </label>

            <SelectField
              label="State"
              value={filters.state}
              options={response?.filters.states ?? []}
              onChange={(value) => updateFilter("state", value)}
            />
            <SelectField
              label="College type"
              value={filters.type}
              options={response?.filters.types ?? []}
              onChange={(value) => updateFilter("type", value)}
            />
            <SelectField
              label="Course"
              value={filters.course}
              options={response?.filters.courses ?? []}
              onChange={(value) => updateFilter("course", value)}
            />
            <SelectField
              label="Exam"
              value={filters.exam}
              options={response?.filters.exams ?? []}
              onChange={(value) => updateFilter("exam", value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium text-ink">
                Max fees
                <input
                  className="form-field mt-1"
                  min="0"
                  placeholder="300000"
                  type="number"
                  value={filters.maxFees}
                  onChange={(event) =>
                    updateFilter("maxFees", event.target.value)
                  }
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Min rating
                <input
                  className="form-field mt-1"
                  max="5"
                  min="0"
                  placeholder="4"
                  step="0.1"
                  type="number"
                  value={filters.minRating}
                  onChange={(event) =>
                    updateFilter("minRating", event.target.value)
                  }
                />
              </label>
            </div>

            <label className="block text-sm font-medium text-ink">
              Sort by
              <select
                className="form-field mt-1"
                value={filters.sort}
                onChange={(event) => updateFilter("sort", event.target.value)}
              >
                <option value="relevance">Best match</option>
                <option value="rating">Rating</option>
                <option value="fees-low">Lowest fees</option>
                <option value="placements">Placements</option>
              </select>
            </label>

            <button
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-muted hover:text-ink"
              type="button"
              onClick={() => setFilters(defaultFilters)}
            >
              <X size={16} />
              Reset filters
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-brand-700">
                {response
                  ? `${response.meta.total} colleges from database`
                  : "Loading colleges"}
              </p>
              <h2 className="text-2xl font-bold text-ink sm:text-3xl">
                Search, shortlist, and compare
              </h2>
            </div>
            <Link
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
                selected.length >= 2
                  ? "bg-brand-700 text-white hover:bg-ink"
                  : "border border-line bg-white text-muted"
              }`}
              href={compareHref}
            >
              Compare {selected.length ? `(${selected.length})` : ""}
              <ArrowRight size={16} />
            </Link>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-line bg-white">
              <div className="flex items-center gap-3 text-muted">
                <Loader2 className="animate-spin" size={20} />
                Loading colleges from API...
              </div>
            </div>
          ) : null}

          {!loading && response?.items.length === 0 ? (
            <div className="rounded-lg border border-line bg-white p-8 text-center">
              <h3 className="text-lg font-semibold text-ink">
                No colleges match these filters
              </h3>
              <p className="mt-2 text-sm text-muted">
                Try reducing fees, clearing course filters, or searching a city.
              </p>
            </div>
          ) : null}

          {!loading && response?.items.length ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {response.items.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    compareDisabled={selected.length >= 3}
                    selectedForCompare={selected.some(
                      (item) => item.id === college.id
                    )}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>

              <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-lg border border-line bg-white p-3 sm:flex-row">
                <p className="text-sm text-muted">
                  Page {response.meta.page} of {response.meta.totalPages || 1}
                </p>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted disabled:opacity-50"
                    disabled={response.meta.page <= 1}
                    type="button"
                    onClick={() => updateFilter("page", filters.page - 1)}
                  >
                    Previous
                  </button>
                  <button
                    className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-muted disabled:opacity-50"
                    disabled={response.meta.page >= response.meta.totalPages}
                    type="button"
                    onClick={() => updateFilter("page", filters.page + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <select
        className="form-field mt-1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
