"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, MessageSquarePlus, Send } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { useAuth } from "@/components/auth-provider";
import type {
  CollegeCardData,
  CollegeListResponse,
  DiscussionQuestion
} from "@/types/domain";

export function DiscussionBoard() {
  const searchParams = useSearchParams();
  const initialCollegeSlug = searchParams.get("collegeSlug") ?? "";
  const { user, openAuth } = useAuth();
  const [q, setQ] = useState("");
  const [collegeSlug, setCollegeSlug] = useState(initialCollegeSlug);
  const [questions, setQuestions] = useState<DiscussionQuestion[]>([]);
  const [collegeOptions, setCollegeOptions] = useState<CollegeCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [tags, setTags] = useState("admissions, placements");
  const [posting, setPosting] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q.trim()) {
      params.set("q", q.trim());
    }
    if (collegeSlug) {
      params.set("collegeSlug", collegeSlug);
    }
    return params.toString();
  }, [collegeSlug, q]);

  async function loadQuestions() {
    setLoading(true);
    setError("");

    try {
      const data = await apiFetch<{ questions: DiscussionQuestion[] }>(
        `/api/discussions?${queryString}`
      );
      setQuestions(data.questions);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load discussions."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadQuestions();
    }, 220);

    return () => window.clearTimeout(timer);
  }, [queryString]);

  useEffect(() => {
    async function loadCollegeOptions() {
      const data = await apiFetch<CollegeListResponse>(
        "/api/colleges?pageSize=24&sort=rating"
      );
      setCollegeOptions(data.items);
    }

    void loadCollegeOptions();
  }, []);

  async function createQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      openAuth("login");
      return;
    }

    setPosting(true);
    setError("");
    try {
      await apiFetch("/api/discussions", {
        method: "POST",
        body: JSON.stringify({
          title,
          body,
          collegeId: selectedCollegeId || undefined,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        })
      });
      setTitle("");
      setBody("");
      await loadQuestions();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create question."
      );
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="section-shell py-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-brand-700">
          Student discussion system
        </p>
        <h1 className="text-3xl font-bold text-ink">Q&A discussions</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-ink">Browse</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-ink">
                Search discussions
                <input
                  className="form-field mt-1"
                  placeholder="rank, placements, branch"
                  value={q}
                  onChange={(event) => setQ(event.target.value)}
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                College
                <select
                  className="form-field mt-1"
                  value={collegeSlug}
                  onChange={(event) => setCollegeSlug(event.target.value)}
                >
                  <option value="">All colleges</option>
                  {collegeOptions.map((college) => (
                    <option key={college.id} value={college.slug}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <MessageSquarePlus size={20} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-ink">Ask a question</h2>
                <p className="text-sm text-muted">
                  Login is required to post.
                </p>
              </div>
            </div>

            <form className="space-y-3" onSubmit={createQuestion}>
              <label className="block text-sm font-medium text-ink">
                Title
                <input
                  className="form-field mt-1"
                  minLength={8}
                  placeholder="Should I choose..."
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Details
                <textarea
                  className="form-field mt-1 min-h-28 resize-y"
                  minLength={12}
                  placeholder="Share exam, rank, goals, and constraints."
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-medium text-ink">
                Related college
                <select
                  className="form-field mt-1"
                  value={selectedCollegeId}
                  onChange={(event) => setSelectedCollegeId(event.target.value)}
                >
                  <option value="">General question</option>
                  {collegeOptions.map((college) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-ink">
                Tags
                <input
                  className="form-field mt-1"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                />
              </label>
              <button
                className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60"
                disabled={posting}
                type="submit"
              >
                {posting ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}
                Post question
              </button>
            </form>
          </section>
        </aside>

        <section className="min-w-0">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-line bg-white">
              <div className="flex items-center gap-3 text-muted">
                <Loader2 className="animate-spin" size={20} />
                Loading discussions...
              </div>
            </div>
          ) : null}

          {!loading && questions.length === 0 ? (
            <div className="rounded-lg border border-line bg-white p-8 text-center">
              <h2 className="text-xl font-bold text-ink">No discussions yet</h2>
              <p className="mt-2 text-sm text-muted">
                Ask the first question for this filter.
              </p>
            </div>
          ) : null}

          {!loading && questions.length ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onAnswered={loadQuestions}
                />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  onAnswered
}: {
  question: DiscussionQuestion;
  onAnswered: () => Promise<void>;
}) {
  const { user, openAuth } = useAuth();
  const [answer, setAnswer] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      openAuth("login");
      return;
    }

    setPosting(true);
    setError("");
    try {
      await apiFetch(`/api/discussions/${question.id}/answers`, {
        method: "POST",
        body: JSON.stringify({ body: answer })
      });
      setAnswer("");
      await onAnswered();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to answer."
      );
    } finally {
      setPosting(false);
    }
  }

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">{question.title}</h2>
          <p className="mt-1 text-sm text-muted">
            Asked by {question.user.name} on{" "}
            {new Date(question.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
        <span className="w-fit rounded-md bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">
          {question._count.answers} answers
        </span>
      </div>

      {question.college ? (
        <Link
          className="mt-3 inline-block rounded-md border border-line px-2 py-1 text-xs font-semibold text-muted hover:text-brand-700"
          href={`/colleges/${question.college.slug}`}
        >
          {question.college.name}
        </Link>
      ) : null}

      <p className="mt-4 leading-7 text-muted">{question.body}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <span
            key={`${question.id}-${tag}`}
            className="rounded-md bg-surface px-2 py-1 text-xs font-medium text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      {question.answers.length ? (
        <div className="mt-5 space-y-3 border-t border-line pt-4">
          {question.answers.map((item) => (
            <div key={item.id} className="rounded-lg bg-surface p-3">
              <p className="text-sm leading-6 text-ink">{item.body}</p>
              <p className="mt-2 text-xs text-muted">
                {item.user.name} - {new Date(item.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={submitAnswer}>
        <input
          className="form-field"
          minLength={6}
          placeholder="Write an answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          required
        />
        <button
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          disabled={posting}
          type="submit"
        >
          {posting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          Answer
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </article>
  );
}
