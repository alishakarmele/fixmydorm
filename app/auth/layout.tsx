/**
 * FixMyDorm – Auth Layout
 *
 * Split-screen auth layout with branded dark panel on left
 * and form on right. Mobile: full-width form with gradient header.
 */

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex-col justify-between p-12">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.2),transparent)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          }}
        />

        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl">🏠</span>
            <span className="text-2xl font-bold text-white">{APP_NAME}</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Your hostel life,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              simplified
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-md leading-relaxed">
            Report issues, track progress, and make your dorm better — all in
            one place, powered by AI.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["AI Complaints", "Anonymous Wall", "Lost & Found", "Leave Requests"].map(
              (f) => (
                <span
                  key={f}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                >
                  {f}
                </span>
              )
            )}
          </div>
        </div>

        <p className="relative text-xs text-white/30">
          © {new Date().getFullYear()} {APP_NAME}
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden bg-gradient-to-r from-slate-900 to-slate-800 p-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
