"use client";

import Link from "next/link";
import { Bookmark, LogOut, Search, UserRound } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { AuthModal } from "@/components/auth-modal";

const navItems = [
  { href: "/", label: "Search" },
  { href: "/compare", label: "Compare" },
  { href: "/predictor", label: "Predictor" },
  { href: "/saved", label: "Saved" }
];

export function Header() {
  const { user, loading, openAuth, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/92 backdrop-blur">
        <div className="section-shell flex min-h-16 items-center justify-between gap-4">
          <Link className="flex items-center gap-2" href="/">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-700 text-white shadow-sm">
              <Search size={18} />
            </span>
            <span className="text-base font-bold text-ink sm:text-lg">
              College Discovery
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-brand-50 hover:text-brand-700"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  aria-label="Saved colleges"
                  className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-muted hover:text-brand-700"
                  href="/saved"
                  title="Saved colleges"
                >
                  <Bookmark size={18} />
                </Link>
                <div className="hidden items-center gap-2 rounded-lg border border-line px-3 py-2 md:flex">
                  <UserRound size={16} className="text-brand-700" />
                  <span className="max-w-36 truncate text-sm font-medium text-ink">
                    {user.name}
                  </span>
                </div>
                <button
                  aria-label="Log out"
                  className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-line bg-white text-muted hover:text-ink"
                  title="Log out"
                  type="button"
                  onClick={() => void logout()}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                className="focus-ring rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-ink disabled:opacity-60"
                disabled={loading}
                type="button"
                onClick={() => openAuth("login")}
              >
                Login
              </button>
            )}
          </div>
        </div>

        <nav className="section-shell flex gap-1 overflow-x-auto pb-3 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="whitespace-nowrap rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <AuthModal />
    </>
  );
}
