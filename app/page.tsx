/**
 * FixMyDorm – Landing Page
 */

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  MessageSquareWarning,
  Megaphone,
  PackageSearch,
  DoorOpen,
  UtensilsCrossed,
  BotMessageSquare,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquareWarning,
    title: "Smart Complaints",
    description: "AI categorizes and prioritizes complaints. Track every issue from submission to resolution.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Megaphone,
    title: "The Wall",
    description: "Post anonymous grievances, upvote issues, get official responses from management.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: PackageSearch,
    title: "Lost & Found",
    description: "Report and browse lost items. Connect finders with owners quickly.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: DoorOpen,
    title: "Leave Requests",
    description: "Digital early leave and late entry approvals — no paper, no chasing wardens.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: UtensilsCrossed,
    title: "Mess Menu",
    description: "Today's menu at a glance. Rate meals and share feedback with the mess team.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: BotMessageSquare,
    title: "AI Help",
    description: "Instant answers about hostel rules, complaint status, and everything in between.",
    gradient: "from-pink-500 to-rose-500",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] text-center px-4 overflow-hidden bg-[#0a0a0f]">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")" }} />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            Now live for your hostel
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Fix your dorm.<br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Effortlessly.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto leading-relaxed">
            One platform for hostel complaints, lost items, leave requests,
            mess menus, and an AI assistant — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/auth/signup"
              className={buttonVariants({
                size: "lg",
                className: "h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 border-0 text-white shadow-xl shadow-violet-500/20",
              })}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/auth/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-12 px-8 text-base border-white/15 text-white/80 hover:bg-white/8 hover:text-white",
              })}
            >
              Sign In
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-sm text-white/40">
            {["Free to use", "Email sign-up", "AI-powered", "Real-time tracking"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-background py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              From raising a complaint to checking tonight's dinner — FixMyDorm has it all.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group rounded-2xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
                >
                  <div className={`inline-flex rounded-xl p-3 bg-gradient-to-br ${f.gradient} mb-4 shadow-md`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0a0a0f] py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/30 to-transparent pointer-events-none" />
        <div className="relative max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to get started?</h2>
          <p className="text-white/50">Sign up in 30 seconds. No credit card. No phone number.</p>
          <Link
            href="/auth/signup"
            className={buttonVariants({
              size: "lg",
              className: "h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 border-0 text-white",
            })}
          >
            Create your account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-[#0a0a0f] border-t border-white/5 py-6 text-center text-xs text-white/20">
        © {new Date().getFullYear()} FixMyDorm
      </footer>
    </div>
  );
}
