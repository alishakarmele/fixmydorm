/**
 * FixMyDorm - Auth Layout
 *
 * Centered card layout for authentication pages (login, signup, verify).
 * No navbar or sidebar — clean, focused auth experience.
 */

import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 px-4 py-8">
      {/* Brand Header */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity"
      >
        <span className="text-3xl">🏠</span>
        <span>FixMyDorm</span>
      </Link>

      {/* Auth Content */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer */}
      <p className="mt-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} FixMyDorm · Built for WeMakeDevs AWS
        Hackathon
      </p>
    </div>
  );
}
