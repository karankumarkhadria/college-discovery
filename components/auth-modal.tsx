"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/fetcher";
import { useAuth } from "@/components/auth-provider";

export function AuthModal() {
  const { authOpen, authMode, closeAuth, openAuth, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!authOpen) {
    return null;
  }

  const isSignup = authMode === "signup";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await apiFetch(`/api/auth/${isSignup ? "signup" : "login"}`, {
        method: "POST",
        body: JSON.stringify(
          isSignup
            ? {
                name,
                email,
                password
              }
            : {
                email,
                password
              }
        )
      });
      await refreshUser();
      closeAuth();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Authentication failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 py-6">
      <div className="w-full max-w-md rounded-xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              Student account
            </p>
            <h2 className="text-xl font-semibold text-ink">
              {isSignup ? "Create account" : "Log in"}
            </h2>
          </div>
          <button
            aria-label="Close auth modal"
            className="focus-ring rounded-full p-2 text-muted hover:bg-surface hover:text-ink"
            type="button"
            onClick={closeAuth}
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 px-5 pt-5">
          <button
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              !isSignup
                ? "bg-brand-700 text-white"
                : "border border-line bg-white text-ink hover:border-brand-500"
            }`}
            type="button"
            onClick={() => openAuth("login")}
          >
            Login
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              isSignup
                ? "bg-brand-700 text-white"
                : "border border-line bg-white text-ink hover:border-brand-500"
            }`}
            type="button"
            onClick={() => openAuth("signup")}
          >
            Signup
          </button>
        </div>

        <form className="space-y-4 px-5 py-5" onSubmit={submit}>
          {isSignup ? (
            <label className="block text-sm font-medium text-ink">
              Name
              <input
                className="form-field mt-1"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          ) : null}

          <label className="block text-sm font-medium text-ink">
            Email
            <input
              className="form-field mt-1"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium text-ink">
            Password
            <input
              className="form-field mt-1"
              minLength={isSignup ? 8 : undefined}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {isSignup ? (
              <span className="mt-1 block text-xs text-muted">
                Use at least 8 characters.
              </span>
            ) : null}
          </label>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            className="focus-ring w-full rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Please wait..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
