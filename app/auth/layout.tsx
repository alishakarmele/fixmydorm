/**
 * FixMyDorm – Auth Layout
 *
 * Split-screen auth with warm olive/cream/peach branded left panel.
 * ✦ Old money aesthetic: floating blobs, grid texture, glass card,
 *   gradient text, smooth entrance animations.
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
      {/* Left Panel — Brand (espresso dark) */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 bg-[oklch(0.18_0.025_55)]">
        {/* Floating blobs */}
        <style>{`
          @keyframes authF1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(22px,-16px) scale(1.03); } }
          @keyframes authF2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-16px,22px) scale(0.97); } }
          @keyframes authF3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(10px,14px); } }
          .auth-f1 { animation: authF1 10s ease-in-out infinite; }
          .auth-f2 { animation: authF2 14s ease-in-out infinite; }
          .auth-f3 { animation: authF3 12s ease-in-out infinite; }
        `}</style>
        <div className="auth-f1 absolute top-[15%] left-[10%] w-[380px] h-[380px] rounded-full blur-[130px] pointer-events-none bg-[oklch(0.42_0.10_130/0.12)]" />
        <div className="auth-f2 absolute bottom-[15%] right-[10%] w-[320px] h-[320px] rounded-full blur-[110px] pointer-events-none bg-[oklch(0.72_0.09_42/0.10)]" />
        <div className="auth-f3 absolute top-[50%] left-[60%] w-[200px] h-[200px] rounded-full blur-[100px] pointer-events-none bg-[oklch(0.45_0.06_50/0.08)]" />

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }} />

        {/* Breathing rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.03] pointer-events-none" style={{ animation: "authF1 8s ease-in-out infinite" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.02] pointer-events-none" style={{ animation: "authF2 12s ease-in-out infinite" }} />

        <div className="relative">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-lg">🏠</span>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{APP_NAME}</span>
          </Link>
        </div>

        <div className="relative space-y-6" style={{ animation: "fadeInUp 1s ease-out 0.3s both" }}>
          <style>{`@keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }`}</style>
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            Your hostel life,{" "}
            <span className="bg-gradient-to-r from-[oklch(0.68_0.10_130)] to-[oklch(0.55_0.08_130)] bg-clip-text text-transparent">simplified</span>
          </h2>
          <p className="text-white/45 text-lg max-w-md leading-relaxed">
            Report issues, track progress, and make your dorm better — all in
            one place, powered by AI.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {["AI Complaints", "Anonymous Wall", "Lost & Found", "Voice Notes"].map((f, i) => (
              <span key={f} className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 backdrop-blur-sm transition-all duration-400 hover:bg-white/[0.08] hover:text-white/70 hover:border-white/15 hover:scale-105" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                {f}
              </span>
            ))}
          </div>

          {/* Testimonial Card — glass */}
          <div className="mt-8 rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-xl p-5 max-w-sm transition-all duration-500 hover:bg-white/[0.06] hover:border-white/12 hover:shadow-lg hover:shadow-[oklch(0.42_0.10_130/0.1)] hover:-translate-y-1">
            <p className="text-sm text-white/55 italic leading-relaxed">
              &ldquo;FixMyDorm got my broken geyser fixed in 2 hours. The voice complaint feature is a game changer!&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[oklch(0.42_0.10_130)] to-[oklch(0.45_0.06_50)] flex items-center justify-center text-xs text-white font-bold">R</div>
              <div>
                <p className="text-xs text-white/65 font-medium">Rahul K.</p>
                <p className="text-[10px] text-white/35">Aryabhatta Hall, Room 204</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/25">
          © {new Date().getFullYear()} {APP_NAME} · Built on AWS
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-col bg-[oklch(0.965_0.016_78)]">
        {/* Mobile header */}
        <div className="lg:hidden bg-[oklch(0.18_0.025_55)] p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl transition-transform duration-400 group-hover:scale-110">🏠</span>
            <span className="text-xl font-extrabold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{APP_NAME}</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-[420px] anim-fade-in-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
