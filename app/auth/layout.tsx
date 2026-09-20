/**
 * FixMyDorm – Auth Layout
 *
 * Split-screen auth with warm olive/cream/peach branded left panel.
 * Matches the landing page and dashboard palette exactly.
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
      {/* Left Panel — Brand (olive dark) */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 bg-[oklch(0.22_0.025_80)]">
        {/* Floating blobs */}
        <style>{`
          @keyframes authF1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-15px); } }
          @keyframes authF2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px,20px); } }
          .auth-f1 { animation: authF1 8s ease-in-out infinite; }
          .auth-f2 { animation: authF2 10s ease-in-out infinite; }
        `}</style>
        <div className="auth-f1 absolute top-[15%] left-[10%] w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none bg-[oklch(0.46_0.095_128/0.15)]" />
        <div className="auth-f2 absolute bottom-[15%] right-[10%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none bg-[oklch(0.75_0.08_45/0.12)]" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }} />

        <div className="relative">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl transition-transform group-hover:scale-110">🏠</span>
            <span className="text-2xl font-bold text-white">{APP_NAME}</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Your hostel life,{" "}
            <span className="text-[oklch(0.7_0.1_128)]">simplified</span>
          </h2>
          <p className="text-white/50 text-lg max-w-md leading-relaxed">
            Report issues, track progress, and make your dorm better — all in
            one place, powered by AI.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {["AI Complaints", "Anonymous Wall", "Lost & Found", "Voice Notes"].map((f) => (
              <span key={f} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/60 backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 max-w-sm">
            <p className="text-sm text-white/60 italic leading-relaxed">
              &ldquo;FixMyDorm got my broken geyser fixed in 2 hours. The voice complaint feature is a game changer!&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[oklch(0.46_0.095_128)] to-[oklch(0.65_0.07_160)] flex items-center justify-center text-xs text-white font-bold">R</div>
              <div>
                <p className="text-xs text-white/70 font-medium">Rahul K.</p>
                <p className="text-[10px] text-white/40">Aryabhatta Hall, Room 204</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/30">
          © {new Date().getFullYear()} {APP_NAME} · Built on AWS
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-col bg-[oklch(0.975_0.014_88)]">
        {/* Mobile header */}
        <div className="lg:hidden bg-[oklch(0.22_0.025_80)] p-6 border-b border-white/5">
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
