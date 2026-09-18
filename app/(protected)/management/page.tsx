/**
 * FixMyDorm - Management Dashboard
 *
 * Placeholder dashboard for management users.
 * Will show complaint overview, stats, and management actions in Phase 3.
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
  ClipboardList,
  Megaphone,
  PackageSearch,
  DoorOpen,
  UtensilsCrossed,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const MANAGEMENT_LINKS = [
  {
    title: "All Complaints",
    description: "Review & manage student complaints",
    href: "/management/complaints",
    icon: ClipboardList,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    title: "The Wall",
    description: "Monitor anonymous posts",
    href: "/wall",
    icon: Megaphone,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Lost & Found",
    description: "Manage lost item reports",
    href: "/lost-found",
    icon: PackageSearch,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Leave Requests",
    description: "Approve or reject requests",
    href: "/leave-requests",
    icon: DoorOpen,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Mess Menu",
    description: "Update menus & view feedback",
    href: "/mess-menu",
    icon: UtensilsCrossed,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    title: "Analytics",
    description: "Complaint trends & stats",
    href: "/management/analytics",
    icon: BarChart3,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

export default function ManagementDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Management Dashboard 🛡️
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}. Manage
          hostel operations from here.
        </p>
      </div>

      {/* Management Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MANAGEMENT_LINKS.map((link) => {
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
          { label: "Pending Complaints", value: "—", sub: "Coming in Phase 3" },
          { label: "Resolved Today", value: "—", sub: "Coming in Phase 3" },
          { label: "Avg Resolution Time", value: "—", sub: "Coming in Phase 3" },
          { label: "Pending Approvals", value: "—", sub: "Coming in Phase 6" },
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
