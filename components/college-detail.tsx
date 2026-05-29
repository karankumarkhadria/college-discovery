"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  ExternalLink,
  IndianRupee,
  Loader2,
  MapPin,
  Star
} from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { formatCompactCurrency, formatPackage } from "@/lib/format";
import type { CollegeDetailData } from "@/types/domain";
import { SaveCollegeButton } from "@/components/save-college-button";
import { useAuth } from "@/components/auth-provider";
import { CollegeImage } from "@/components/college-image";

export function CollegeDetail({ slug }: { slug: string }) {
  const { user, openAuth } = useAuth();
  const [college, setCollege] = useState<CollegeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewError, setReviewError] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCollege() {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch<CollegeDetailData>(`/api/colleges/${slug}`);
        if (active) {
          setCollege(data);
        }
      } catch (caughtError) {
        if (active) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load college."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCollege();

    return () => {
      active = false;
    };
  }, [slug]);

  async function reloadCollege() {
    const data = await apiFetch<CollegeDetailData>(`/api/colleges/${slug}`);
    setCollege(data);
  }

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      openAuth("login");
      return;
    }

    setReviewSubmitting(true);
    setReviewError("");

    try {
      await apiFetch(`/api/colleges/${slug}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          title: reviewTitle,
          body: reviewBody,
          rating: Number(reviewRating)
        })
      });
      setReviewTitle("");
      setReviewBody("");
      setReviewRating("5");
      await reloadCollege();
    } catch (caughtError) {
      setReviewError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to post review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="section-shell grid min-h-[520px] place-items-center py-10">
        <div className="flex items-center gap-3 text-muted">
          <Loader2 className="animate-spin" size={20} />
          Loading college profile...
        </div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="section-shell py-10">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm text-muted" href="/">
          <ArrowLeft size={16} />
          Back to search
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "College not found."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <CollegeImage
          alt={`${college.name} campus`}
          className="absolute inset-0 h-full w-full"
          fallbackClassName="absolute inset-0 h-full w-full"
          src={college.imageUrl}
        />
        <div className="relative bg-[#101820]/88">
          <div className="section-shell hero-readable py-10 text-white">
            <Link
              className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-semibold backdrop-blur hover:bg-white/20"
              href="/"
            >
              <ArrowLeft size={16} />
              Back to search
            </Link>

            <div className="max-w-4xl">
              <div className="mb-3 flex flex-wrap gap-2">
                {college.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-ink shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
                {college.name}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white sm:text-base">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={17} />
                  {college.city}, {college.state}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Building2 size={17} />
                  Est. {college.establishedYear}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star size={17} />
                  {college.rating}/5 from {college.reviewCount} reviews
                </span>
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <SaveCollegeButton
                collegeId={college.id}
                initialSaved={college.isSaved}
              />
              <Link
                className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ink"
                href={`/compare?ids=${college.slug}`}
              >
                Compare
                <BarChart3 size={16} />
              </Link>
              <a
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-brand-50"
                href={college.website}
                rel="noreferrer"
                target="_blank"
              >
                Website
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="section-shell grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Overview</h2>
            <p className="mt-3 leading-7 text-muted">{college.overview}</p>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Courses</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="text-left text-muted">
                    <th className="border-b border-line pb-3">Program</th>
                    <th className="border-b border-line pb-3">Degree</th>
                    <th className="border-b border-line pb-3">Exam</th>
                    <th className="border-b border-line pb-3">Closing rank</th>
                    <th className="border-b border-line pb-3">Annual fee</th>
                    <th className="border-b border-line pb-3">Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {college.courses.map((course) => (
                    <tr key={course.id} className="text-ink">
                      <td className="border-b border-line py-3 font-semibold">
                        {course.name}
                      </td>
                      <td className="border-b border-line py-3">
                        {course.degree}
                      </td>
                      <td className="border-b border-line py-3">
                        {course.exam}
                      </td>
                      <td className="border-b border-line py-3">
                        {course.closingRank?.toLocaleString("en-IN")}
                      </td>
                      <td className="border-b border-line py-3">
                        {formatCompactCurrency(course.annualFee)}
                      </td>
                      <td className="border-b border-line py-3">
                        {course.seats}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-ink">Reviews</h2>
              <span className="text-sm font-semibold text-brand-700">
                Student feedback
              </span>
            </div>
            <form
              className="mt-4 rounded-lg border border-line bg-surface p-4"
              onSubmit={submitReview}
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <label className="block text-sm font-medium text-ink">
                  Review title
                  <input
                    className="form-field mt-1"
                    minLength={4}
                    placeholder="Great placements"
                    value={reviewTitle}
                    onChange={(event) => setReviewTitle(event.target.value)}
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Rating
                  <select
                    className="form-field mt-1"
                    value={reviewRating}
                    onChange={(event) => setReviewRating(event.target.value)}
                  >
                    <option value="5">5 / 5</option>
                    <option value="4">4 / 5</option>
                    <option value="3">3 / 5</option>
                    <option value="2">2 / 5</option>
                    <option value="1">1 / 5</option>
                  </select>
                </label>
              </div>
              <label className="mt-3 block text-sm font-medium text-ink">
                Review
                <textarea
                  className="form-field mt-1 min-h-24 resize-y"
                  minLength={12}
                  placeholder="Write what future students should know."
                  value={reviewBody}
                  onChange={(event) => setReviewBody(event.target.value)}
                  required
                />
              </label>
              {reviewError ? (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {reviewError}
                </p>
              ) : null}
              <button
                className="focus-ring mt-3 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60"
                disabled={reviewSubmitting}
                type="submit"
              >
                {reviewSubmitting ? "Posting..." : "Post review"}
              </button>
            </form>
            <div className="mt-4 grid gap-3">
              {college.reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-lg border border-line bg-surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-ink">{review.title}</h3>
                      <p className="text-sm text-muted">By {review.author}</p>
                    </div>
                    <span className="rounded-md bg-accent-100 px-2 py-1 text-sm font-bold text-accent-700">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {review.body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Placement Snapshot</h2>
            <div className="mt-4 grid gap-3">
              <SummaryMetric
                icon={<BarChart3 size={18} />}
                label="Placement rate"
                value={`${college.placementRate}%`}
              />
              <SummaryMetric
                icon={<IndianRupee size={18} />}
                label="Average package"
                value={formatPackage(college.averagePackage)}
              />
              <SummaryMetric
                icon={<IndianRupee size={18} />}
                label="Highest package"
                value={formatPackage(college.highestPackage)}
              />
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Top recruiters</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {college.topRecruiters.map((recruiter) => (
                <span
                  key={recruiter}
                  className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink"
                >
                  {recruiter}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-ink">Accepted exams</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {college.examsAccepted.map((exam) => (
                <span
                  key={exam}
                  className="rounded-md bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700"
                >
                  {exam}
                </span>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SummaryMetric({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-3">
      <div className="flex items-center gap-2 text-muted">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}
