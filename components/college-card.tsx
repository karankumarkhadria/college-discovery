"use client";

import Link from "next/link";
import { BarChart3, IndianRupee, MapPin, Star } from "lucide-react";
import type { CollegeCardData } from "@/types/domain";
import { formatCompactCurrency, formatPackage } from "@/lib/format";
import { SaveCollegeButton } from "@/components/save-college-button";
import { CollegeImage } from "@/components/college-image";

type CollegeCardProps = {
  college: CollegeCardData;
  selectedForCompare: boolean;
  compareDisabled: boolean;
  onToggleCompare: (college: CollegeCardData) => void;
};

export function CollegeCard({
  college,
  selectedForCompare,
  compareDisabled,
  onToggleCompare
}: CollegeCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link
        className="block h-36 overflow-hidden"
        href={`/colleges/${college.slug}`}
        aria-label={`Open ${college.name}`}
      >
        <CollegeImage
          alt={`${college.name} campus`}
          className="h-full w-full"
          src={college.imageUrl}
        />
      </Link>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
                {college.type}
              </span>
              <span className="rounded-md bg-warn-100 px-2 py-1 text-xs font-semibold text-warn-600">
                {college.accreditation}
              </span>
            </div>
            <Link
              className="line-clamp-2 text-lg font-bold leading-snug text-ink hover:text-brand-700"
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
            initialSaved={college.isSaved}
          />
        </div>

        <p className="line-clamp-3 min-h-16 text-sm leading-6 text-muted">
          {college.overview}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <Metric
            icon={<IndianRupee size={15} />}
            label="Fees"
            value={`${formatCompactCurrency(college.feeMin)}+`}
          />
          <Metric
            icon={<Star size={15} />}
            label="Rating"
            value={`${college.rating}/5`}
          />
          <Metric
            icon={<BarChart3 size={15} />}
            label="Avg pkg"
            value={formatPackage(college.averagePackage)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {college.courses.slice(0, 2).map((course) => (
            <span
              key={`${college.id}-${course.name}`}
              className="rounded-md border border-line px-2 py-1 text-xs text-muted"
            >
              {course.degree} {course.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input
              checked={selectedForCompare}
              className="h-4 w-4 rounded border-line text-brand-600"
              disabled={!selectedForCompare && compareDisabled}
              type="checkbox"
              onChange={() => onToggleCompare(college)}
            />
            Compare
          </label>
          <Link
            className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            href={`/colleges/${college.slug}`}
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

function Metric({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface p-2">
      <div className="flex items-center gap-1 text-muted">{icon}</div>
      <p className="mt-1 text-[11px] font-medium uppercase text-muted">
        {label}
      </p>
      <p className="truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
