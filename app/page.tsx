/**
 * FixMyDorm – Premium Landing Page
 *
 * Warm pastel gradient hero with floating orbs, animated feature grid,
 * smooth scroll reveal, and premium glass-morphism cards.
 */

import Link from "next/link";
import {
  MessageSquareWarning,
  Megaphone,
  PackageSearch,
  DoorOpen,
  UtensilsCrossed,
  BotMessageSquare,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquareWarning,
    title: "Smart Complaints",
    description: "AI categorizes and prioritizes complaints. Track every issue from submission to resolution.",
    gradient: "from-rose-400 to-orange-300",
    delay: "0s",
  },
  {
    icon: Megaphone,
    title: "The Wall",
    description: "Post anonymous grievances, upvote issues, get official responses from management.",
    gradient: "from-violet-400 to-indigo-300",
    delay: "0.1s",
  },
  {
    icon: PackageSearch,
    title: "Lost & Found",
    description: "Report and browse lost items. AI-powered matching connects finders with owners.",
    gradient: "from-sky-400 to-cyan-300",
    delay: "0.2s",
  },
  {
    icon: DoorOpen,
    title: "Leave Requests",
    description: "Digital early leave and late entry approvals — no paper, no chasing wardens.",
    gradient: "from-emerald-400 to-teal-300",
    delay: "0.3s",
  },
  {
    icon: UtensilsCrossed,
    title: "Mess Menu",
    description: "Today&apos;s menu at a glance. Rate meals and share feedback with the mess team.",
    gradient: "from-amber-400 to-yellow-300",
    delay: "0.4s",
  },
  {
    icon: BotMessageSquare,
    title: "AI Help",
    description: "Instant answers about hostel rules, complaint status, and everything in between.",
    gradient: "from-pink-400 to-rose-300",
    delay: "0.5s",
  },
];

const STATS = [
  { value: "500+", label: "Issues Resolved" },
  { value: "3.8h", label: "Avg Resolution" },
  { value: "98%", label: "Student Satisfaction" },
  { value: "24/7", label: "AI Support" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* ─── Inline Animations ─── */}
      <style>{`
        @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-20px) scale(1.05); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,30px) scale(0.95); } }
        @keyframes float3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(15px,25px) scale(1.03); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity:0; transform: translateX(-40px); } to { opacity:1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity:0; transform: scale(0.9); } to { opacity:1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulse-slow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .anim-float1 { animation: float1 8s ease-in-out infinite; }
        .anim-float2 { animation: float2 10s ease-in-out infinite; }
        .anim-float3 { animation: float3 12s ease-in-out infinite; }
        .anim-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
        .anim-slideInLeft { animation: slideInLeft 0.8s ease-out both; }
        .anim-scaleIn { animation: scaleIn 0.6s ease-out both; }
        .anim-shimmer { background-size: 200% 100%; animation: shimmer 3s linear infinite; }
        .anim-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>

      {/* ─── HERO ─── */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)" }}
      >
        {/* Floating orbs */}
        <div className="anim-float1 absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(244,162,97,0.25) 0%, transparent 70%)" }} />
        <div className="anim-float2 absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(233,196,106,0.2) 0%, transparent 70%)" }} />
        <div className="anim-float3 absolute top-[50%] left-[60%] w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(231,111,81,0.15) 0%, transparent 70%)" }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }} />

        {/* Glow ring behind heading */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03] anim-pulse-slow pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/[0.02] anim-pulse-slow pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Live badge */}
          <div className="anim-fadeInUp inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-sm backdrop-blur-md" style={{ animationDelay: "0.1s" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white/70">Powered by <span className="text-amber-300 font-semibold">AWS</span> &middot; Live for your hostel</span>
          </div>

          {/* Heading */}
          <h1 className="anim-fadeInUp text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05]" style={{ animationDelay: "0.3s" }}>
            Fix your dorm.<br />
            <span className="anim-shimmer bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
              Effortlessly.
            </span>
          </h1>

          <p className="anim-fadeInUp text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: "0.5s" }}>
            One platform for hostel complaints, anonymous grievances, lost items,
            leave requests, mess menus &mdash; all powered by AI and AWS services.
          </p>

          {/* CTAs */}
          <div className="anim-fadeInUp flex flex-col sm:flex-row items-center justify-center gap-4 pt-2" style={{ animationDelay: "0.7s" }}>
            <Link
              href="/auth/signup"
              className="group relative inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25"
              style={{ background: "linear-gradient(135deg, #e76f51 0%, #f4a261 50%, #e9c46a 100%)" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            </Link>
            <Link
              href="/auth/login"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-8 text-base font-medium text-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12] hover:border-white/30 hover:scale-105"
            >
              Sign In
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          {/* Trust points */}
          <div className="anim-fadeInUp flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-sm text-white/40" style={{ animationDelay: "0.9s" }}>
            {["Free to use", "Email sign-up", "AI-powered", "Real-time tracking"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs">
          <span>Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative -mt-16 z-20 px-4">
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl shadow-black/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="anim-scaleIn text-center" style={{ animationDelay: `${1.1 + i * 0.1}s` }}>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="bg-background py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              FEATURES
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Everything your hostel{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">needs</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base">
              From raising a complaint to checking tonight&apos;s dinner — FixMyDorm has it all, powered by AWS AI services.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="anim-fadeInUp group relative rounded-2xl border bg-card p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 overflow-hidden"
                  style={{ animationDelay: f.delay }}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className={`inline-flex rounded-xl p-3 bg-gradient-to-br ${f.gradient} mb-4 shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── AWS POWERED BANNER ─── */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f3460 0%, #1a1a2e 50%, #16213e 100%)" }}>
        <div className="anim-float1 absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px]" style={{ background: "rgba(244,162,97,0.1)" }} />
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-amber-400" />
            Enterprise-grade infrastructure
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Built on <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">AWS Cloud</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {[
              { icon: Zap, title: "Amazon Bedrock", desc: "AI classification, sentiment analysis, and priority detection" },
              { icon: Shield, title: "Amazon Cognito", desc: "Secure authentication with role-based access control" },
              { icon: Sparkles, title: "Amazon Transcribe", desc: "Voice-to-text for hands-free complaint filing" },
            ].map((s) => (
              <div key={s.title} className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 text-left transition-all duration-300 hover:border-amber-400/30 hover:bg-white/[0.08]">
                <s.icon className="h-6 w-6 text-amber-400 mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="py-24 px-4 text-center relative overflow-hidden" style={{ background: "linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)" }}>
        <div className="anim-float2 absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px]" style={{ background: "rgba(244,162,97,0.15)" }} />
        </div>
        <div className="relative max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            Ready to fix{" "}
            <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">your dorm?</span>
          </h2>
          <p className="text-white/50 text-lg">Sign up in 30 seconds. No credit card. No phone number.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/auth/signup"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25"
              style={{ background: "linear-gradient(135deg, #e76f51 0%, #f4a261 50%, #e9c46a 100%)" }}
            >
              Create your account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/login"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-8 text-base font-medium text-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12] hover:border-white/30"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 text-center text-xs border-t border-white/5" style={{ background: "#0d1b2a" }}>
        <p className="text-white/30">© {new Date().getFullYear()} FixMyDorm &middot; Built with ❤️ on AWS</p>
      </footer>
    </div>
  );
}
