"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Gauge, Loader2, SearchCheck } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { formatCompactCurrency, formatPackage } from "@/lib/format";
import type { CollegeListResponse } from "@/types/domain";
import { CollegeImage } from "@/components/college-image";

type PredictorResponse = {
  exam: string;
  rank: number;
  usedFallback: boolean;
  summary: {
    counts: {
      Safe: number;
      Target: number;
      Reach: number;
    };
    bestFit: string | null;
    strongestPlacement: string | null;
    bestPackage: string | null;
    bestRoi: string | null;
  };
  recommendations: {
    bucket: "Reach" | "Target" | "Safe";
    confidence: number;
    rankGap: number;
    roiScore: number;
    reasons: string[];
    course: {
      id: string;
      name: string;
      degree: string;
      annualFee: number;
      closingRank: number;
      exam: string;
    };
    college: {
      id: string;
      slug: string;
      name: string;
      city: string;
      state: string;
      rating: number;
      averagePackage: number;
      placementRate: number;
      feeMin: number;
      feeMax: number;
      imageUrl: string;
    };
  }[];
};

export function PredictorTool() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState("4200");
  const [preferredState, setPreferredState] = useState("all");
  const [maxFees, setMaxFees] = useState("");
  const [options, setOptions] = useState<CollegeListResponse["filters"] | null>(
    null
  );
  const [result, setResult] = useState<PredictorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      const data = await apiFetch<CollegeListResponse>("/api/colleges?pageSize=6");
      setOptions(data.filters);
      if (data.filters.exams.includes("JEE Main")) {
        setExam("JEE Main");
      } else if (data.filters.exams[0]) {
        setExam(data.filters.exams[0]);
      }
    }

    void loadOptions();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch<PredictorResponse>("/api/predictor", {
        method: "POST",
        body: JSON.stringify({
          exam,
          rank: Number(rank),
          preferredState,
          maxFees: maxFees ? Number(maxFees) : undefined
        })
      });
      setResult(data);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to predict colleges."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-700">
          Dataset-backed matching
        </p>
        <h1 className="text-3xl font-bold text-ink">College predictor</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Enter an exam and rank. The API checks course closing ranks, location,
          and budget to return reach, target, and safe recommendations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          className="h-fit rounded-lg border border-line bg-white p-5 shadow-sm lg:sticky lg:top-24"
          onSubmit={submit}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <Gauge size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-ink">Rank input</h2>
              <p className="text-sm text-muted">Works across seeded exams.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-ink">
              Exam
              <select
                className="form-field mt-1"
                value={exam}
                onChange={(event) => setExam(event.target.value)}
              >
                {(options?.exams ?? [exam]).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-ink">
              Rank
              <input
                className="form-field mt-1"
                min="1"
                type="number"
                value={rank}
                onChange={(event) => setRank(event.target.value)}
                required
              />
            </label>

            <label className="block text-sm font-medium text-ink">
              Preferred state
              <select
                className="form-field mt-1"
                value={preferredState}
                onChange={(event) => setPreferredState(event.target.value)}
              >
                <option value="all">All states</option>
                {(options?.states ?? []).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-ink">
              Max annual fees
              <input
                className="form-field mt-1"
                min="0"
                placeholder="Optional"
                type="number"
                value={maxFees}
                onChange={(event) => setMaxFees(event.target.value)}
              />
            </label>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60"
              disabled={loading}
              type="submit"
            >
              {loading ? <Loader2 className="animate-spin" size={17} /> : <SearchCheck size={17} />}
              Predict colleges
            </button>

            <div className="rounded-lg border border-line bg-surface p-3 text-sm leading-6 text-muted">
              <p className="font-semibold text-ink">Scoring rule</p>
              <p>
                If your rank is better than the closing rank, the course is
                eligible. A larger buffer becomes Safe, a medium buffer becomes
                Target, and a very close cutoff becomes Reach.
              </p>
            </div>
          </div>
        </form>

        <section className="min-w-0">
          {!result ? (
            <div className="rounded-lg border border-dashed border-line bg-white p-8 text-center">
              <h2 className="text-xl font-bold text-ink">
                Recommendations will appear here
              </h2>
              <p className="mt-2 text-sm text-muted">
                Try JEE Main rank 4200, JEE Advanced rank 600, or VITEEE rank
                9000.
              </p>
            </div>
          ) : null}

          {result?.usedFallback ? (
            <div className="mb-4 rounded-lg border border-warn-100 bg-orange-50 p-4 text-sm text-warn-600">
              No exact eligible course was found for that rank and filters, so
              the API returned nearby options for the same exam.
            </div>
          ) : null}

          {result ? (
            <div className="space-y-4">
              <PredictorSummary result={result} />
              <div className="grid gap-4 md:grid-cols-2">
                {result.recommendations.map((item) => (
                <article
                  key={`${item.college.id}-${item.course.id}`}
                  className="overflow-hidden rounded-lg border border-line bg-white shadow-sm"
                >
                  <CollegeImage
                    alt={`${item.college.name} campus`}
                    className="h-32 w-full"
                    src={item.college.imageUrl}
                  />
                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-bold ${bucketClass(item.bucket)}`}
                        >
                          {item.bucket}
                        </span>
                        <Link
                          className="mt-2 block text-lg font-bold text-ink hover:text-brand-700"
                          href={`/colleges/${item.college.slug}`}
                        >
                          {item.college.name}
                        </Link>
                        <p className="text-sm text-muted">
                          {item.college.city}, {item.college.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-700">
                          {item.confidence}%
                        </p>
                        <p className="text-xs text-muted">match</p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-line bg-surface p-3">
                      <p className="font-semibold text-ink">
                        {item.course.degree} {item.course.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        Closing rank {item.course.closingRank.toLocaleString("en-IN")} via {item.course.exam}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-brand-700">
                        {rankMessage(result.rank, item.course.closingRank)}
                      </p>
                    </div>

                    <div className="rounded-lg border border-line p-3">
                      <p className="text-xs font-semibold uppercase text-muted">
                        Why this match
                      </p>
                      <ul className="mt-2 space-y-1 text-sm leading-5 text-muted">
                        {item.reasons.map((reason) => (
                          <li key={reason}>- {reason}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <SmallMetric
                        label="Fees"
                        value={formatCompactCurrency(item.course.annualFee)}
                      />
                      <SmallMetric
                        label="Avg pkg"
                        value={formatPackage(item.college.averagePackage)}
                      />
                      <SmallMetric
                        label="Placement"
                        value={`${item.college.placementRate}%`}
                      />
                      <SmallMetric
                        label="ROI"
                        value={`${item.roiScore}x`}
                      />
                    </div>
                  </div>
                </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function PredictorSummary({ result }: { result: PredictorResponse }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase text-brand-700">
            Prediction summary
          </p>
          <h2 className="text-xl font-bold text-ink">
            {result.summary.bestFit
              ? `Best first match: ${result.summary.bestFit}`
              : "No recommendations found"}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <BucketCount label="Safe" value={result.summary.counts.Safe} />
          <BucketCount label="Target" value={result.summary.counts.Target} />
          <BucketCount label="Reach" value={result.summary.counts.Reach} />
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SummaryFact label="Best package" value={result.summary.bestPackage ?? "-"} />
        <SummaryFact
          label="Strongest placement"
          value={result.summary.strongestPlacement ?? "-"}
        />
        <SummaryFact label="Best ROI" value={result.summary.bestRoi ?? "-"} />
      </div>
    </div>
  );
}

function BucketCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-2">
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
    </div>
  );
}

function SummaryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="truncate font-bold text-ink">{value}</p>
    </div>
  );
}

function bucketClass(bucket: "Reach" | "Target" | "Safe") {
  if (bucket === "Safe") {
    return "bg-accent-100 text-accent-700";
  }

  if (bucket === "Target") {
    return "bg-brand-50 text-brand-700";
  }

  return "bg-warn-100 text-warn-600";
}

function rankMessage(rank: number, closingRank: number) {
  if (rank <= closingRank) {
    return `Your rank is ${(
      closingRank - rank
    ).toLocaleString("en-IN")} ranks inside the cutoff.`;
  }

  return `Your rank is ${(
    rank - closingRank
  ).toLocaleString("en-IN")} ranks outside the cutoff.`;
}
