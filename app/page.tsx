/**
 * FixMyDorm – Premium Landing Page
 *
 * Olive · Cream · Peach palette matching the rest of the app.
 * IntersectionObserver-based scroll animations.
 * Rich content: hero, stats, features, how it works, AWS section,
 * testimonials, and CTA.
 */

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquareWarning, Megaphone, PackageSearch, DoorOpen,
  UtensilsCrossed, BotMessageSquare, ArrowRight, CheckCircle2,
  Zap, Shield, Sparkles, Mic, FileSearch, Bell,
  ChevronDown, Star, Quote,
} from "lucide-react";

/* ─── Scroll reveal hook ──────────────────────────────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    children.forEach((child) => {
      (child as HTMLElement).style.opacity = "0";
      (child as HTMLElement).style.transform = "translateY(40px)";
      (child as HTMLElement).style.transition = `opacity 0.7s ease-out ${(child as HTMLElement).dataset.delay || "0s"}, transform 0.7s ease-out ${(child as HTMLElement).dataset.delay || "0s"}`;
      observer.observe(child);
    });
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── Data ────────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: MessageSquareWarning, title: "Smart Complaints", description: "AI categorizes, prioritizes, and routes complaints. Voice or text — just describe the issue and we handle the rest.", gradient: "from-[oklch(0.55_0.1_128)] to-[oklch(0.65_0.07_160)]" },
  { icon: Megaphone, title: "The Wall", description: "Anonymous grievance board with upvoting. When an issue affects many, it rises to the top for management attention.", gradient: "from-[oklch(0.75_0.08_45)] to-[oklch(0.8_0.07_30)]" },
  { icon: PackageSearch, title: "Lost & Found", description: "Report and browse lost items. AI-powered Rekognition matching connects finders with owners instantly.", gradient: "from-[oklch(0.55_0.1_128)] to-[oklch(0.6_0.07_160)]" },
  { icon: DoorOpen, title: "Leave Requests", description: "Digital early leave and late entry approvals — no paper, no chasing wardens. Instant notifications.", gradient: "from-[oklch(0.65_0.07_160)] to-[oklch(0.55_0.1_128)]" },
  { icon: UtensilsCrossed, title: "Mess Menu", description: "Today's menu at a glance. Rate meals, share feedback, and help improve the hostel dining experience.", gradient: "from-[oklch(0.75_0.08_45)] to-[oklch(0.7_0.06_90)]" },
  { icon: BotMessageSquare, title: "AI Help", description: "Instant answers about hostel rules, complaint status, and everything in between — powered by Amazon Bedrock.", gradient: "from-[oklch(0.8_0.07_30)] to-[oklch(0.75_0.08_45)]" },
];

const STEPS = [
  { num: "01", icon: Mic, title: "Describe your issue", desc: "Type or use voice notes. Our AI transcribes and understands your complaint instantly." },
  { num: "02", icon: Sparkles, title: "AI classifies & routes", desc: "Amazon Bedrock auto-detects category, priority, and urgency. No manual forms needed." },
  { num: "03", icon: Bell, title: "Track & resolve", desc: "Get real-time updates. Management responds within SLA. Rate the resolution." },
];

const TESTIMONIALS = [
  { name: "Rahul K.", hostel: "Aryabhatta Hall, Room 204", text: "Got my broken geyser fixed in 2 hours. The voice complaint feature is a game changer!", rating: 5 },
  { name: "Priya M.", hostel: "CV Raman Hall, Room 112", text: "The Wall feature helped us get the common room AC fixed. When 50 people upvote, management listens!", rating: 5 },
  { name: "Amit S.", hostel: "Bose Hall, Room 308", text: "Lost my ID card and someone found it through the Lost & Found section. AI matched it instantly!", rating: 4 },
];

const STATS = [
  { value: "500+", label: "Issues Resolved" },
  { value: "3.8h", label: "Avg Resolution Time" },
  { value: "98%", label: "Student Satisfaction" },
  { value: "24/7", label: "AI Support" },
];

export default function Home() {
  const pageRef = useScrollReveal();

  return (
    <div ref={pageRef} className="flex flex-col min-h-screen overflow-hidden">
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes heroFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(25px,-18px) scale(1.04); } }
        @keyframes heroFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-18px,22px) scale(0.96); } }
        @keyframes heroFloat3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(12px,15px); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulseSoft { 0%,100% { opacity: 0.5; } 50% { opacity: 0.8; } }
        .hero-float1 { animation: heroFloat1 8s ease-in-out infinite; }
        .hero-float2 { animation: heroFloat2 10s ease-in-out infinite; }
        .hero-float3 { animation: heroFloat3 12s ease-in-out infinite; }
        .hero-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
        .hero-shimmer { background-size: 200% 100%; animation: shimmer 4s linear infinite; }
        .pulse-soft { animation: pulseSoft 4s ease-in-out infinite; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO — Olive/cream/peach warm palette
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden bg-[oklch(0.975_0.014_88)]">
        {/* Floating blobs in olive, peach, sage */}
        <div className="hero-float1 absolute top-[8%] left-[12%] w-[420px] h-[420px] rounded-full blur-[130px] pointer-events-none bg-[oklch(0.7_0.1_128/0.18)]" />
        <div className="hero-float2 absolute bottom-[8%] right-[8%] w-[380px] h-[380px] rounded-full blur-[110px] pointer-events-none bg-[oklch(0.75_0.08_45/0.2)]" />
        <div className="hero-float3 absolute top-[55%] left-[55%] w-[280px] h-[280px] rounded-full blur-[100px] pointer-events-none bg-[oklch(0.65_0.07_160/0.12)]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='oklch(0.46 0.095 128)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }} />

        {/* Pulse rings */}
        <div className="pulse-soft absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[oklch(0.46_0.095_128/0.06)] pointer-events-none" />
        <div className="pulse-soft absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-[oklch(0.75_0.08_45/0.04)] pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="hero-fadeInUp inline-flex items-center gap-2 rounded-full border border-[oklch(0.46_0.095_128/0.2)] bg-[oklch(0.46_0.095_128/0.06)] px-5 py-2 text-sm backdrop-blur-sm" style={{ animationDelay: "0.1s" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.55_0.1_128)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.55_0.1_128)]" />
            </span>
            <span className="text-[oklch(0.35_0.04_100)]">Powered by <span className="text-[oklch(0.46_0.095_128)] font-semibold">AWS AI</span> · Live for your hostel</span>
          </div>

          {/* Heading */}
          <h1 className="hero-fadeInUp text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[oklch(0.22_0.025_80)] leading-[1.05]" style={{ animationDelay: "0.3s" }}>
            Fix your dorm.<br />
            <span className="hero-shimmer bg-gradient-to-r from-[oklch(0.46_0.095_128)] via-[oklch(0.75_0.08_45)] to-[oklch(0.8_0.07_30)] bg-clip-text text-transparent">
              Effortlessly.
            </span>
          </h1>

          <p className="hero-fadeInUp text-lg sm:text-xl text-[oklch(0.52_0.03_90)] max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: "0.5s" }}>
            One platform for hostel complaints, anonymous grievances, lost items,
            leave requests, mess menus &mdash; all powered by AI and AWS services.
          </p>

          {/* CTAs */}
          <div className="hero-fadeInUp flex flex-col sm:flex-row items-center justify-center gap-4 pt-2" style={{ animationDelay: "0.7s" }}>
            <Link
              href="/auth/signup"
              className="group relative inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-[oklch(0.97_0.01_100)] overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[oklch(0.46_0.095_128/0.25)] bg-[oklch(0.46_0.095_128)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-[oklch(0.4_0.095_128)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/auth/login"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border-2 border-[oklch(0.46_0.095_128/0.3)] bg-[oklch(0.46_0.095_128/0.06)] px-8 text-base font-medium text-[oklch(0.35_0.04_100)] transition-all duration-300 hover:bg-[oklch(0.46_0.095_128/0.12)] hover:border-[oklch(0.46_0.095_128/0.5)] hover:scale-105"
            >
              Sign In
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          {/* Trust points */}
          <div className="hero-fadeInUp flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-sm text-[oklch(0.52_0.03_90)]" style={{ animationDelay: "0.9s" }}>
            {["Free to use", "Email sign-up", "AI-powered", "Real-time tracking"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[oklch(0.55_0.1_128)]" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[oklch(0.52_0.03_90)] text-xs">
          <span>Scroll to explore</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATS — Glassmorphism bar
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-14 z-20 px-4">
        <div data-reveal className="max-w-4xl mx-auto rounded-2xl border border-[oklch(0.88_0.025_80)] bg-[oklch(0.99_0.008_85/0.9)] backdrop-blur-xl p-6 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <div key={stat.label} data-reveal data-delay={`${0.1 + i * 0.1}s`} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[oklch(0.46_0.095_128)]">{stat.value}</p>
                <p className="text-xs sm:text-sm text-[oklch(0.52_0.03_90)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[oklch(0.975_0.014_88)] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div data-reveal className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.46_0.095_128/0.08)] px-4 py-1.5 text-xs font-semibold text-[oklch(0.46_0.095_128)] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[oklch(0.22_0.025_80)]">
              Everything your hostel{" "}
              <span className="text-[oklch(0.46_0.095_128)]">needs</span>
            </h2>
            <p className="text-[oklch(0.52_0.03_90)] max-w-lg mx-auto text-base">
              From raising a complaint to checking tonight&apos;s dinner — FixMyDorm has it all, powered by AWS AI services.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  data-reveal
                  data-delay={`${i * 0.08}s`}
                  className="group relative rounded-2xl border border-[oklch(0.88_0.025_80)] bg-[oklch(0.99_0.008_85)] p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[oklch(0.46_0.095_128/0.08)] hover:border-[oklch(0.46_0.095_128/0.3)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.46_0.095_128/0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className={`inline-flex rounded-xl p-3 bg-gradient-to-br ${f.gradient} mb-4 shadow-lg shadow-[oklch(0.46_0.095_128/0.15)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-base mb-2 text-[oklch(0.22_0.025_80)] group-hover:text-[oklch(0.46_0.095_128)] transition-colors">{f.title}</h3>
                    <p className="text-sm text-[oklch(0.52_0.03_90)] leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 Steps
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[oklch(0.96_0.018_110)] py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div data-reveal className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.75_0.08_45/0.15)] px-4 py-1.5 text-xs font-semibold text-[oklch(0.55_0.06_45)] uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" />
              How it works
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[oklch(0.22_0.025_80)]">
              Three steps to a{" "}
              <span className="text-[oklch(0.46_0.095_128)]">better dorm</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} data-reveal data-delay={`${i * 0.15}s`} className="relative text-center group">
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[oklch(0.88_0.025_80)] to-[oklch(0.46_0.095_128/0.2)]" />
                  )}
                  <div className="relative z-10 inline-flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-[oklch(0.99_0.008_85)] border-2 border-[oklch(0.88_0.025_80)] shadow-lg flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-[oklch(0.46_0.095_128/0.4)] group-hover:shadow-xl group-hover:scale-110">
                      <Icon className="h-8 w-8 text-[oklch(0.46_0.095_128)]" />
                    </div>
                    <span className="text-xs font-bold text-[oklch(0.46_0.095_128)] mb-2 tracking-widest">{step.num}</span>
                    <h3 className="font-semibold text-lg text-[oklch(0.22_0.025_80)] mb-2">{step.title}</h3>
                    <p className="text-sm text-[oklch(0.52_0.03_90)] leading-relaxed max-w-xs">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          AWS POWERED
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[oklch(0.22_0.025_80)] py-24 px-4 relative overflow-hidden">
        <div className="hero-float1 absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] bg-[oklch(0.46_0.095_128/0.1)]" />
        <div className="hero-float2 absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full blur-[100px] bg-[oklch(0.75_0.08_45/0.08)]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div data-reveal className="text-center mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-[oklch(0.75_0.08_45)]" />
              Enterprise-grade infrastructure
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Built on <span className="text-[oklch(0.7_0.1_128)]">AWS Cloud</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Every feature is backed by production-grade AWS services for reliability, security, and intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Sparkles, title: "Amazon Bedrock", desc: "AI classification, sentiment analysis, auto-priority" },
              { icon: Shield, title: "Amazon Cognito", desc: "Secure auth with role-based access control" },
              { icon: Mic, title: "Amazon Transcribe", desc: "Voice-to-text for hands-free complaint filing" },
              { icon: FileSearch, title: "Amazon Rekognition", desc: "Image moderation and lost item matching" },
            ].map((s, i) => (
              <div key={s.title} data-reveal data-delay={`${i * 0.1}s`} className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 transition-all duration-300 hover:border-[oklch(0.7_0.1_128/0.4)] hover:bg-white/[0.08] hover:-translate-y-1">
                <s.icon className="h-7 w-7 text-[oklch(0.7_0.1_128)] mb-3" />
                <h3 className="text-sm font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[oklch(0.975_0.014_88)] py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div data-reveal className="text-center mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.75_0.08_45/0.15)] px-4 py-1.5 text-xs font-semibold text-[oklch(0.55_0.06_45)] uppercase tracking-wider">
              <Quote className="h-3.5 w-3.5" />
              Testimonials
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[oklch(0.22_0.025_80)]">
              Students{" "}
              <span className="text-[oklch(0.46_0.095_128)]">love it</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} data-reveal data-delay={`${i * 0.12}s`} className="rounded-2xl border border-[oklch(0.88_0.025_80)] bg-[oklch(0.99_0.008_85)] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[oklch(0.75_0.08_45)] text-[oklch(0.75_0.08_45)]" />
                  ))}
                </div>
                <p className="text-sm text-[oklch(0.35_0.04_100)] leading-relaxed mb-4 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-[oklch(0.88_0.025_80)]">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[oklch(0.46_0.095_128)] to-[oklch(0.65_0.07_160)] flex items-center justify-center text-sm text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[oklch(0.22_0.025_80)]">{t.name}</p>
                    <p className="text-xs text-[oklch(0.52_0.03_90)]">{t.hostel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTTOM CTA
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-[oklch(0.22_0.025_80)] py-24 px-4 text-center relative overflow-hidden">
        <div className="hero-float2 absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] bg-[oklch(0.46_0.095_128/0.12)]" />
        </div>
        <div className="relative max-w-xl mx-auto space-y-6">
          <div data-reveal>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Ready to fix{" "}
              <span className="text-[oklch(0.7_0.1_128)]">your dorm?</span>
            </h2>
          </div>
          <p data-reveal data-delay="0.1s" className="text-white/50 text-lg">Sign up in 30 seconds. No credit card. No phone number.</p>
          <div data-reveal data-delay="0.2s" className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/auth/signup"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-[oklch(0.97_0.01_100)] bg-[oklch(0.46_0.095_128)] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[oklch(0.46_0.095_128/0.3)] hover:bg-[oklch(0.4_0.095_128)]"
            >
              Create your account
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-8 text-base font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.12] hover:border-white/30"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[oklch(0.17_0.02_100)] border-t border-white/5 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <span className="text-sm font-semibold text-white/60">FixMyDorm</span>
          </div>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} FixMyDorm · Built with ❤️ on AWS</p>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
