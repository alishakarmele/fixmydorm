/**
 * FixMyDorm - Sidebar Component
 *
 * Side navigation with role-aware links.
 * Collapsible on mobile via shadcn Sheet overlay.
 * Premium hover effects, active indicators, and smooth transitions.
 *
 * Student links:  Dashboard, My Complaints, The Wall, Lost & Found,
 *                 Leave Requests, Mess Menu, AI Help
 * Management:     Dashboard, All Complaints, The Wall, Lost & Found,
 *                 Leave Requests, Mess Menu
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Megaphone,
  PackageSearch,
  DoorOpen,
  UtensilsCrossed,
  BotMessageSquare,
  ClipboardList,
} from "lucide-react";

// ============================================================================
// Navigation Config
// ============================================================================

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: ("student" | "management")[];
  emoji: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["student", "management"],
    emoji: "🏠",
  },
  {
    label: "My Complaints",
    href: "/complaints",
    icon: MessageSquareWarning,
    roles: ["student"],
    emoji: "📋",
  },
  {
    label: "All Complaints",
    href: "/management/complaints",
    icon: ClipboardList,
    roles: ["management"],
    emoji: "📊",
  },
  {
    label: "The Wall",
    href: "/wall",
    icon: Megaphone,
    roles: ["student", "management"],
    emoji: "📢",
  },
  {
    label: "Lost & Found",
    href: "/lost-found",
    icon: PackageSearch,
    roles: ["student", "management"],
    emoji: "🔍",
  },
  {
    label: "Leave Requests",
    href: "/leave-requests",
    icon: DoorOpen,
    roles: ["student", "management"],
    emoji: "🚪",
  },
  {
    label: "Mess Menu",
    href: "/mess-menu",
    icon: UtensilsCrossed,
    roles: ["student", "management"],
    emoji: "🍽",
  },
  {
    label: "AI Help",
    href: "/ai-help",
    icon: BotMessageSquare,
    roles: ["student"],
    emoji: "🤖",
  },
];

// ============================================================================
// Sidebar Content
// ============================================================================

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const { role } = useAuth();

  const filteredItems = NAV_ITEMS.filter(
    (item) => role && item.roles.includes(role)
  );

  return (
    <div className="flex h-full flex-col">
      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 stagger-children">
        {filteredItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm border border-primary/10"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground hover:translate-x-1"
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-primary to-[oklch(0.55_0.08_130)] rounded-r-full anim-fade-in" />
              )}

              <span className={cn(
                "transition-all duration-300",
                isActive
                  ? "scale-110"
                  : "group-hover:scale-110 group-hover:rotate-6"
              )}>
                <Icon className="h-4 w-4 shrink-0" />
              </span>
              <span className="relative">
                {item.label}
                {/* Hover underline sweep */}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-400 rounded-full" />
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4">
        <Separator className="mb-3" />
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            FixMyDorm v0.1.0
          </p>
          <p className="text-[10px] text-muted-foreground/50">
            ✦ Old Money Edition
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Desktop Sidebar
// ============================================================================

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r bg-sidebar/80 backdrop-blur-sm anim-fade-in-left">
      <SidebarContent />
    </aside>
  );
}

// ============================================================================
// Mobile Sidebar (Sheet overlay)
// ============================================================================

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-60 p-0 backdrop-blur-xl">
        {/* Brand in mobile sheet */}
        <div className="flex h-14 items-center gap-2 border-b px-4 font-bold text-lg">
          <span className="text-xl">🏠</span>
          <span className="bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.72_0.09_42)] bg-clip-text text-transparent font-extrabold">
            FixMyDorm
          </span>
        </div>
        <SidebarContent onNavClick={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
