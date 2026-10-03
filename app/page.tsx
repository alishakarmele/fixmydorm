/**
 * FixMyDorm – Premium Landing Page
 * ✦ Section-by-section scroll animations
 * ✦ Text glides from left/right, blur-to-sharp reveals
 * ✦ Old Money · Olive · Peach · Brown
 */

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MessageSquareWarning, Megaphone, PackageSearch, DoorOpen,
  UtensilsCrossed, BotMessageSquare, ArrowRight, CheckCircle2,
  Zap, Shield, Sparkles, Mic, FileSearch, Bell,
  ChevronDown, Star, Quote,
} from "lucide-react";

/* ─── Scroll-triggered section reveal ─────────────────────────────────────── */
function useScrollSections() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-anim]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("anim-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─── Parallax mouse ──────────────────────────────────────────────────────── */
function useParallax() {
  const [o, setO] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => {
      setO({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return o;
}

/* ─── Data ────────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: MessageSquareWarning, title: "Smart Complaints", desc: "AI categorizes, prioritizes, and routes complaints. Voice or text — just describe the issue.", grad: "from-[oklch(0.42_0.10_130)] to-[oklch(0.55_0.06_160)]" },
  { icon: Megaphone, title: "The Wall", desc: "Anonymous grievance board with upvoting. Issues rise to the top for management attention.", grad: "from-[oklch(0.72_0.09_42)] to-[oklch(0.78_0.07_30)]" },
  { icon: PackageSearch, title: "Lost & Found", desc: "Report and browse lost items. AI-powered Rekognition matching connects finders with owners.", grad: "from-[oklch(0.45_0.06_50)] to-[oklch(0.55_0.06_70)]" },
  { icon: DoorOpen, title: "Leave Requests", desc: "Digital early leave and late entry approvals — no paper, no chasing wardens.", grad: "from-[oklch(0.55_0.06_130)] to-[oklch(0.42_0.10_130)]" },
  { icon: UtensilsCrossed, title: "Mess Menu", desc: "Today's menu at a glance. Rate meals, share feedback, and improve dining.", grad: "from-[oklch(0.72_0.09_42)] to-[oklch(0.60_0.06_90)]" },
  { icon: BotMessageSquare, title: "AI Help", desc: "Instant answers about hostel rules, complaint status — powered by Amazon Bedrock.", grad: "from-[oklch(0.42_0.10_130)] to-[oklch(0.72_0.09_42)]" },
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
  { value: "3.8h", label: "Avg Resolution" },
  { value: "98%", label: "Satisfaction" },
  { value: "24/7", label: "AI Support" },
];

/* ─── CSS for scroll animations (injected once) ──────────────────────────── */
const SCROLL_CSS = `
  [data-anim] {
    opacity: 0;
    transition: opacity 1s cubic-bezier(0.4,0,0.2,1),
                transform 1s cubic-bezier(0.34,1.56,0.64,1),
                filter 0.8s ease-out;
  }
  [data-anim].anim-visible { opacity: 1 !important; transform: none !important; filter: blur(0) !important; }

  [data-anim="up"]    { transform: translateY(60px); filter: blur(4px); }
  [data-anim="down"]  { transform: translateY(-40px); filter: blur(3px); }
  [data-anim="left"]  { transform: translateX(-80px); filter: blur(4px); }
  [data-anim="right"] { transform: translateX(80px); filter: blur(4px); }
  [data-anim="scale"] { transform: scale(0.85); filter: blur(6px); }
  [data-anim="fade"]  { filter: blur(2px); }

  [data-delay="1"] { transition-delay: 0.1s; }
  [data-delay="2"] { transition-delay: 0.2s; }
  [data-delay="3"] { transition-delay: 0.3s; }
  [data-delay="4"] { transition-delay: 0.4s; }
  [data-delay="5"] { transition-delay: 0.5s; }
  [data-delay="6"] { transition-delay: 0.6s; }
  [data-delay="7"] { transition-delay: 0.7s; }
  [data-delay="8"] { transition-delay: 0.8s; }
  [data-delay="9"] { transition-delay: 0.9s; }
`;

export default function Home() {
  const pageRef = useScrollSections();
  const m = useParallax();

  return (
    <div ref={pageRef} className="flex flex-col min-h-screen overflow-hidden">
      <style>{SCROLL_CSS}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden bg-[oklch(0.965_0.016_78)]">
        {/* Parallax blobs */}
        <div className="anim-float-gentle absolute top-[8%] left-[12%] w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none bg-[oklch(0.42_0.10_130/0.12)]" style={{ transform: `translate(${m.x * 0.5}px, ${m.y * 0.5}px)` }} />
        <div className="anim-float-slow absolute bottom-[8%] right-[8%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none bg-[oklch(0.88_0.065_42/0.18)]" style={{ transform: `translate(${m.x * -0.3}px, ${m.y * -0.3}px)` }} />
        <div className="anim-float-drift absolute top-[55%] left-[55%] w-[300px] h-[300px] rounded-full blur-[110px] pointer-events-none bg-[oklch(0.45_0.06_50/0.10)]" style={{ transform: `translate(${m.x * 0.2}px, ${m.y * 0.2}px)` }} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='oklch(0.42 0.10 130)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }} />

        {/* Breathing rings */}
        <div className="anim-breathe-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[oklch(0.42_0.10_130/0.06)] pointer-events-none" />
        <div className="anim-breathe-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border border-[oklch(0.88_0.065_42/0.04)] pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div data-anim="up" className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.42_0.10_130/0.2)] bg-[oklch(0.42_0.10_130/0.06)] px-5 py-2 text-sm backdrop-blur-sm hover:bg-[oklch(0.42_0.10_130/0.1)] transition-all duration-300 hover:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.50_0.10_130)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.50_0.10_130)]" />
            </span>
            <span className="text-[oklch(0.30_0.04_60)]">Powered by <span className="text-[oklch(0.42_0.10_130)] font-semibold">AWS AI</span> · Live for your hostel</span>
          </div>

          {/* Heading — glides from left */}
          <h1 data-anim="left" data-delay="2" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[oklch(0.20_0.03_60)] leading-[1.05]">
            Fix your dorm.<br />
            <span className="anim-shimmer bg-gradient-to-r from-[oklch(0.42_0.10_130)] via-[oklch(0.72_0.09_42)] to-[oklch(0.45_0.06_50)] bg-clip-text text-transparent bg-[length:200%_100%]">
              Effortlessly.
            </span>
          </h1>

          {/* Subtitle — glides from right */}
          <p data-anim="right" data-delay="4" className="text-lg sm:text-xl text-[oklch(0.48_0.03_60)] max-w-2xl mx-auto leading-relaxed">
            One platform for hostel complaints, anonymous grievances, lost items,
            leave requests, mess menus &mdash; all powered by AI and AWS services.
          </p>

          {/* CTAs — fade up */}
          <div data-anim="up" data-delay="6" className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/auth/signup" className="group relative inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-white overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[oklch(0.42_0.10_130/0.3)] bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.35_0.08_130)] anim-glow">
              <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" /></span>
              <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.35_0.08_130)] to-[oklch(0.42_0.10_130)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <Link href="/auth/login" className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl border-2 border-[oklch(0.42_0.10_130/0.25)] bg-[oklch(0.42_0.10_130/0.05)] px-8 text-base font-medium text-[oklch(0.30_0.04_60)] transition-all duration-500 hover:bg-[oklch(0.42_0.10_130/0.12)] hover:border-[oklch(0.42_0.10_130/0.5)] hover:scale-105 hover:shadow-lg backdrop-blur-sm">
              Sign In <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400" />
            </Link>
          </div>

          {/* Trust */}
          <div data-anim="up" data-delay="8" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-sm text-[oklch(0.48_0.03_60)]">
            {["Free to use", "Email sign-up", "AI-powered", "Real-time tracking"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 hover:text-[oklch(0.42_0.10_130)] transition-colors duration-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-[oklch(0.50_0.10_130)]" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[oklch(0.48_0.03_60)] text-xs anim-fade-in" style={{ animationDelay: "1.5s" }}>
          <span className="tracking-widest uppercase text-[10px]">Scroll to explore</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS — Glassmorphism bar
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative -mt-14 z-20 px-4">
        <div data-anim="scale" className="max-w-4xl mx-auto rounded-2xl border border-[oklch(0.86_0.03_70/0.5)] bg-[oklch(0.985_0.01_75/0.85)] backdrop-blur-2xl p-6 shadow-2xl shadow-[oklch(0.42_0.10_130/0.06)] hover:shadow-[oklch(0.42_0.10_130/0.12)] transition-shadow duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={s.label} data-anim="up" data-delay={`${i + 1}`} className="text-center group hover:scale-110 transition-transform duration-500 cursor-default">
                <p className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-b from-[oklch(0.42_0.10_130)] to-[oklch(0.55_0.06_130)] bg-clip-text text-transparent group-hover:from-[oklch(0.72_0.09_42)] group-hover:to-[oklch(0.45_0.06_50)] transition-all duration-500">{s.value}</p>
                <p className="text-xs sm:text-sm text-[oklch(0.48_0.03_60)] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FEATURES — Cards animate on scroll
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[oklch(0.965_0.016_78)] py-28 px-4 overflow-hidden">
        <div className="anim-float-gentle absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full blur-[150px] pointer-events-none bg-[oklch(0.88_0.065_42/0.08)]" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Section header glides from left */}
          <div className="text-center mb-16 space-y-4">
            <div data-anim="left" className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.42_0.10_130/0.08)] px-4 py-1.5 text-xs font-semibold text-[oklch(0.42_0.10_130)] uppercase tracking-[0.2em] hover:bg-[oklch(0.42_0.10_130/0.14)] transition-all duration-300 hover:scale-105">
              <Sparkles className="h-3.5 w-3.5" /> Features
            </div>
            <h2 data-anim="right" data-delay="1" className="text-3xl md:text-5xl font-extrabold tracking-tight text-[oklch(0.20_0.03_60)]">
              Everything your hostel{" "}
              <span className="bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.72_0.09_42)] bg-clip-text text-transparent">needs</span>
            </h2>
            <p data-anim="left" data-delay="2" className="text-[oklch(0.48_0.03_60)] max-w-lg mx-auto text-base leading-relaxed">
              From raising a complaint to checking tonight&apos;s dinner — FixMyDorm has it all.
            </p>
          </div>

          {/* Feature cards — alternate left/right */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const dir = i % 2 === 0 ? "left" : "right";
              return (
                <div key={f.title} data-anim={dir} data-delay={`${(i % 3) + 1}`} className="group relative rounded-2xl border border-[oklch(0.86_0.03_70)] bg-[oklch(0.985_0.01_75)] p-6 transition-all duration-600 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[oklch(0.42_0.10_130/0.10)] hover:border-[oklch(0.42_0.10_130/0.25)] overflow-hidden hover-gradient-border">
                  <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.42_0.10_130/0.04)] via-transparent to-[oklch(0.88_0.065_42/0.03)] opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
                  <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-[oklch(0.42_0.10_130/0.08)] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-600 group-hover:scale-150" />
                  <div className="relative">
                    <div className={`inline-flex rounded-xl p-3 bg-gradient-to-br ${f.grad} mb-4 shadow-lg shadow-[oklch(0.42_0.10_130/0.12)] transition-all duration-500 group-hover:scale-115 group-hover:rotate-6 group-hover:shadow-xl`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-bold text-base mb-2 text-[oklch(0.20_0.03_60)] group-hover:text-[oklch(0.42_0.10_130)] transition-colors duration-400">{f.title}</h3>
                    <p className="text-sm text-[oklch(0.48_0.03_60)] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — Steps glide in alternating
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[oklch(0.95_0.02_100)] py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, oklch(0.42 0.10 130 / 0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <div data-anim="right" className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.09_42/0.12)] px-4 py-1.5 text-xs font-semibold text-[oklch(0.50_0.06_45)] uppercase tracking-[0.2em]">
              <Zap className="h-3.5 w-3.5" /> How it works
            </div>
            <h2 data-anim="left" data-delay="1" className="text-3xl md:text-5xl font-extrabold tracking-tight text-[oklch(0.20_0.03_60)]">
              Three steps to a{" "}
              <span className="bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.45_0.06_50)] bg-clip-text text-transparent">better dorm</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const dir = i === 0 ? "left" : i === 1 ? "up" : "right";
              return (
                <div key={step.num} data-anim={dir} data-delay={`${i + 1}`} className="relative text-center group">
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[oklch(0.86_0.03_70)] to-[oklch(0.42_0.10_130/0.2)]" />
                  )}
                  <div className="relative z-10 inline-flex flex-col items-center">
                    <div className="w-20 h-20 rounded-2xl bg-[oklch(0.985_0.01_75)] border-2 border-[oklch(0.86_0.03_70)] shadow-lg flex items-center justify-center mb-5 transition-all duration-500 group-hover:border-[oklch(0.42_0.10_130/0.4)] group-hover:shadow-2xl group-hover:shadow-[oklch(0.42_0.10_130/0.12)] group-hover:scale-115 group-hover:-rotate-3">
                      <Icon className="h-8 w-8 text-[oklch(0.42_0.10_130)] transition-all duration-500 group-hover:scale-110" />
                    </div>
                    <span className="text-xs font-extrabold text-[oklch(0.42_0.10_130)] mb-2 tracking-[0.3em]">{step.num}</span>
                    <h3 className="font-bold text-lg text-[oklch(0.20_0.03_60)] mb-2">{step.title}</h3>
                    <p className="text-sm text-[oklch(0.48_0.03_60)] leading-relaxed max-w-xs">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          AWS POWERED — Dark section, elements glide in
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[oklch(0.18_0.025_55)] py-28 px-4 overflow-hidden">
        <div className="anim-float-gentle absolute top-0 right-0 w-[350px] h-[350px] rounded-full blur-[120px] bg-[oklch(0.42_0.10_130/0.10)]" />
        <div className="anim-float-slow absolute bottom-0 left-0 w-[280px] h-[280px] rounded-full blur-[110px] bg-[oklch(0.72_0.09_42/0.08)]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14 space-y-4">
            <div data-anim="left" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-[oklch(0.72_0.09_42)]" /> Enterprise-grade infrastructure
            </div>
            <h2 data-anim="right" data-delay="1" className="text-3xl md:text-5xl font-extrabold text-white">
              Built on <span className="bg-gradient-to-r from-[oklch(0.68_0.10_130)] to-[oklch(0.55_0.08_130)] bg-clip-text text-transparent">AWS Cloud</span>
            </h2>
            <p data-anim="left" data-delay="2" className="text-white/40 max-w-lg mx-auto leading-relaxed">
              Every feature is backed by production-grade AWS services for reliability, security, and intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Sparkles, title: "Amazon Bedrock", desc: "AI classification, sentiment analysis, auto-priority" },
              { icon: Shield, title: "Amazon Cognito", desc: "Secure auth with role-based access control" },
              { icon: Mic, title: "Amazon Transcribe", desc: "Voice-to-text for hands-free complaint filing" },
              { icon: FileSearch, title: "Amazon Rekognition", desc: "Image moderation and lost item matching" },
            ].map((s, i) => {
              const dir = i % 2 === 0 ? "left" : "right";
              return (
                <div key={s.title} data-anim={dir} data-delay={`${i + 1}`} className="group rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 transition-all duration-500 hover:border-[oklch(0.68_0.10_130/0.4)] hover:bg-white/[0.08] hover:-translate-y-2 hover:shadow-2xl hover:shadow-[oklch(0.42_0.10_130/0.15)]">
                  <s.icon className="h-7 w-7 text-[oklch(0.68_0.10_130)] mb-3 transition-all duration-500 group-hover:scale-115 group-hover:rotate-6" />
                  <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIALS — Glide from sides
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[oklch(0.965_0.016_78)] py-28 px-4 overflow-hidden">
        <div className="anim-float-slow absolute top-[20%] right-[5%] w-[250px] h-[250px] rounded-full blur-[120px] pointer-events-none bg-[oklch(0.88_0.065_42/0.06)]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14 space-y-4">
            <div data-anim="right" className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.09_42/0.12)] px-4 py-1.5 text-xs font-semibold text-[oklch(0.50_0.06_45)] uppercase tracking-[0.2em]">
              <Quote className="h-3.5 w-3.5" /> Testimonials
            </div>
            <h2 data-anim="left" data-delay="1" className="text-3xl md:text-5xl font-extrabold tracking-tight text-[oklch(0.20_0.03_60)]">
              Students{" "}
              <span className="bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.72_0.09_42)] bg-clip-text text-transparent">love it</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => {
              const dir = i === 0 ? "left" : i === 1 ? "up" : "right";
              return (
                <div key={t.name} data-anim={dir} data-delay={`${i + 1}`} className="group rounded-2xl border border-[oklch(0.86_0.03_70)] bg-[oklch(0.985_0.01_75)] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-[oklch(0.88_0.065_42/0.1)] hover:-translate-y-2 hover:border-[oklch(0.88_0.065_42/0.3)] hover-gradient-border">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[oklch(0.72_0.09_42)] text-[oklch(0.72_0.09_42)] transition-transform duration-300 group-hover:scale-110" style={{ transitionDelay: `${j * 50}ms` }} />
                    ))}
                  </div>
                  <p className="text-sm text-[oklch(0.30_0.04_60)] leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[oklch(0.86_0.03_70)]">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[oklch(0.42_0.10_130)] to-[oklch(0.45_0.06_50)] flex items-center justify-center text-sm text-white font-bold transition-all duration-400 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[oklch(0.42_0.10_130/0.3)]">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[oklch(0.20_0.03_60)]">{t.name}</p>
                      <p className="text-xs text-[oklch(0.48_0.03_60)]">{t.hostel}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM CTA
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[oklch(0.18_0.025_55)] py-28 px-4 text-center overflow-hidden">
        <div className="anim-float-slow absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[140px] bg-[oklch(0.42_0.10_130/0.10)]" />
        </div>

        <div className="relative max-w-xl mx-auto space-y-6">
          <h2 data-anim="left" className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Ready to fix{" "}
            <span className="bg-gradient-to-r from-[oklch(0.68_0.10_130)] to-[oklch(0.72_0.09_42)] bg-clip-text text-transparent">your dorm?</span>
          </h2>
          <p data-anim="right" data-delay="1" className="text-white/45 text-lg">Sign up in 30 seconds. No credit card. No phone number.</p>
          <div data-anim="up" data-delay="2" className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/auth/signup" className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-white bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.35_0.08_130)] transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[oklch(0.42_0.10_130/0.35)] anim-glow">
              Create your account <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
            <Link href="/auth/login" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-8 text-base font-medium text-white/80 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.12] hover:border-white/25 hover:scale-105">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[oklch(0.14_0.02_55)] border-t border-white/5 py-8 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[oklch(0.42_0.10_130/0.2)] to-transparent" />
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group">
            <span className="text-lg transition-transform duration-400 group-hover:scale-125 group-hover:rotate-12">🏠</span>
            <span className="text-sm font-bold bg-gradient-to-r from-white/60 to-white/40 bg-clip-text text-transparent">FixMyDorm</span>
          </div>
          <p className="text-xs text-white/25">© {new Date().getFullYear()} FixMyDorm · Built with ❤️ on AWS</p>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span className="hover:text-white/60 cursor-pointer transition-colors duration-300">Privacy</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors duration-300">Terms</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors duration-300">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
