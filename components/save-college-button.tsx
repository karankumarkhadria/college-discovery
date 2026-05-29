"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { useAuth } from "@/components/auth-provider";

type SaveCollegeButtonProps = {
  collegeId: string;
  initialSaved?: boolean;
  compact?: boolean;
  onChange?: (saved: boolean) => void;
};

export function SaveCollegeButton({
  collegeId,
  initialSaved = false,
  compact = false,
  onChange
}: SaveCollegeButtonProps) {
  const { user, openAuth } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggleSaved() {
    if (!user) {
      openAuth("login");
      return;
    }

    setBusy(true);
    try {
      await apiFetch(`/api/saved-colleges/${collegeId}`, {
        method: saved ? "DELETE" : "POST"
      });
      setSaved(!saved);
      onChange?.(!saved);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      aria-label={saved ? "Remove saved college" : "Save college"}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition disabled:opacity-60 ${
        saved
          ? "border-accent-500 bg-accent-100 text-accent-700"
          : "border-line bg-white text-muted hover:text-brand-700"
      } ${compact ? "h-10 w-10" : "px-3 py-2"}`}
      disabled={busy}
      title={saved ? "Saved" : "Save college"}
      type="button"
      onClick={toggleSaved}
    >
      {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
      {compact ? null : <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
