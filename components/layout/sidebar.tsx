/**
 * FixMyDorm - Sidebar Component
 *
 * Side navigation with role-aware links.
 * Collapsible on mobile via shadcn Sheet overlay.
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
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["student", "management"],
  },
  {
    label: "My Complaints",
    href: "/complaints",
    icon: MessageSquareWarning,
    roles: ["student"],
  },
  {
    label: "All Complaints",
    href: "/management/complaints",
    icon: ClipboardList,
    roles: ["management"],
  },
  {
    label: "The Wall",
    href: "/wall",
    icon: Megaphone,
    roles: ["student", "management"],
  },
  {
    label: "Lost & Found",
    href: "/lost-found",
    icon: PackageSearch,
    roles: ["student", "management"],
  },
  {
    label: "Leave Requests",
    href: "/leave-requests",
    icon: DoorOpen,
    roles: ["student", "management"],
  },
  {
    label: "Mess Menu",
    href: "/mess-menu",
    icon: UtensilsCrossed,
    roles: ["student", "management"],
  },
  {
    label: "AI Help",
    href: "/ai-help",
    icon: BotMessageSquare,
    roles: ["student"],
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
      <nav className="flex-1 space-y-1 px-3 py-4">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4">
        <Separator className="mb-3" />
        <p className="text-xs text-muted-foreground text-center">
          FixMyDorm v0.1.0
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Desktop Sidebar
// ============================================================================

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:border-r bg-sidebar">
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
      <SheetContent side="left" className="w-60 p-0">
        {/* Brand in mobile sheet */}
        <div className="flex h-14 items-center gap-2 border-b px-4 font-bold text-lg">
          <span className="text-xl">🏠</span>
          FixMyDorm
        </div>
        <SidebarContent onNavClick={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}
