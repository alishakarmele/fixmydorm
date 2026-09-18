/**
 * FixMyDorm - Student Dashboard
 *
 * Placeholder dashboard for students.
 * Will be populated with complaint stats, recent activity, etc. in Phase 2+.
 */

"use client";

import { useAuth } from "@/lib/auth/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquareWarning,
  Megaphone,
  PackageSearch,
  DoorOpen,
  UtensilsCrossed,
  BotMessageSquare,
} from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
  {
    title: "Submit Complaint",
    description: "Report a hostel issue",
    href: "/complaints",
    icon: MessageSquareWarning,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "The Wall",
    description: "Anonymous grievance board",
    href: "/wall",
    icon: Megaphone,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Lost & Found",
    description: "Report or find lost items",
    href: "/lost-found",
    icon: PackageSearch,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Leave Request",
    description: "Early leave / late entry",
    href: "/leave-requests",
    icon: DoorOpen,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Mess Menu",
    description: "Today's meals & ratings",
    href: "/mess-menu",
    icon: UtensilsCrossed,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "AI Help",
    description: "Ask the hostel chatbot",
    href: "/ai-help",
    icon: BotMessageSquare,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your FixMyDorm dashboard. What would you like to do today?
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div
                    className={`rounded-lg p-2.5 ${link.bgColor}`}
                  >
                    <Icon className={`h-5 w-5 ${link.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{link.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {link.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Stats Placeholder */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Open Complaints", value: "—", sub: "Coming in Phase 2" },
          { label: "Resolved", value: "—", sub: "Coming in Phase 2" },
          { label: "Wall Posts", value: "—", sub: "Coming in Phase 4" },
          { label: "Lost Items", value: "—", sub: "Coming in Phase 5" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
