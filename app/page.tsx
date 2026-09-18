/**
 * FixMyDorm – Landing Page
 *
 * Public landing page with hero section, feature highlights,
 * and CTA buttons for login/signup.
 */

import Link from "next/link";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import {
  MessageSquareWarning,
  Megaphone,
  PackageSearch,
  DoorOpen,
  UtensilsCrossed,
  BotMessageSquare,
  ArrowRight,
  Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: MessageSquareWarning,
    title: "Smart Complaints",
    description:
      "AI auto-categorizes and prioritizes your complaints. No more lost requests.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Megaphone,
    title: "The Wall",
    description:
      "Post anonymous grievances, upvote issues, and get official responses.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: PackageSearch,
    title: "Lost & Found",
    description:
      "Report lost items with photos. AI matches them with found items automatically.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: DoorOpen,
    title: "Leave Requests",
    description:
      "Request early leave or late entry for events with a simple approval flow.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: UtensilsCrossed,
    title: "Mess Menu",
    description:
      "Check daily menus, rate meals, and share feedback with the mess committee.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: BotMessageSquare,
    title: "AI Help Agent",
    description:
      "Ask the chatbot anything about hostel rules, processes, or your complaints.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

        <div className="relative container mx-auto px-4 py-20 md:py-32 text-center">
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Built on AWS for the WeMakeDevs Hackathon</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-5xl sm:text-6xl md:text-7xl">🏠</span>
              <br />
              {APP_NAME}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {APP_DESCRIPTION}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className={buttonVariants({ size: "lg", className: "min-w-[200px]" })}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className={buttonVariants({ variant: "outline", size: "lg", className: "min-w-[200px]" })}
              >
                Sign In
              </Link>
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap justify-center gap-2 text-xs font-mono pt-4">
              {[
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "AWS Cognito",
                "DynamoDB",
                "Lambda",
                "S3",
                "Bedrock AI",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border bg-muted/50 px-2.5 py-1"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything your hostel needs
          </h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            From complaints to mess menus — one platform for all your hostel
            needs, powered by AI.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div
                  className={`inline-flex rounded-lg p-2.5 ${feature.bgColor} mb-4`}
                >
                  <Icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} FixMyDorm · Built with ❤️ for the
          WeMakeDevs AWS First Commit Hackathon
        </p>
      </footer>
    </main>
  );
}
