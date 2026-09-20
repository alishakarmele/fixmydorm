/**
 * FixMyDorm – Premium Auth Layout
 *
 * Split-screen auth layout with warm gradient branded panel on left
 * and form on right. Animated floating elements, glassmorphism.
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
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)" }}
      >
        {/* Background effects */}
        <style>{`
          @keyframes authFloat1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-15px); } }
          @keyframes authFloat2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-15px,20px); } }
          .auth-float1 { animation: authFloat1 8s ease-in-out infinite; }
          .auth-float2 { animation: authFloat2 10s ease-in-out infinite; }
        `}</style>
        
        <div className="auth-float1 absolute top-[15%] left-[10%] w-[350px] h-[350px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(244,162,97,0.2) 0%, transparent 70%)" }} />
        <div className="auth-float2 absolute bottom-[15%] right-[10%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(233,196,106,0.15) 0%, transparent 70%)" }} />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
          }}
        />

        <div className="relative">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl transition-transform group-hover:scale-110">🏠</span>
            <span className="text-2xl font-bold text-white">{APP_NAME}</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-bold text-white leading-tight">
            Your hostel life,{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
              simplified
            </span>
          </h2>
          <p className="text-white/50 text-lg max-w-md leading-relaxed">
            Report issues, track progress, and make your dorm better — all in
            one place, powered by AI.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["AI Complaints", "Anonymous Wall", "Lost & Found", "Voice Notes"].map(
              (f) => (
                <span
                  key={f}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/60 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white/80"
                >
                  {f}
                </span>
              )
            )}
          </div>

          {/* Testimonial card */}
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 max-w-sm">
            <p className="text-sm text-white/60 italic leading-relaxed">
              &ldquo;FixMyDorm got my broken geyser fixed in 2 hours. The voice complaint feature is a game changer!&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-xs text-white font-bold">R</div>
              <div>
                <p className="text-xs text-white/70 font-medium">Rahul K.</p>
                <p className="text-[10px] text-white/40">Aryabhatta Hall, Room 204</p>
              </div>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/30">
          © {new Date().getFullYear()} {APP_NAME} &middot; Built on AWS
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-col bg-background">
        {/* Mobile header */}
        <div className="lg:hidden p-6 border-b"
          style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)" }}
        >
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
