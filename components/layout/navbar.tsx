/**
 * FixMyDorm - Navbar Component
 *
 * Top navigation bar with:
 * - FixMyDorm logo/brand with hover glow
 * - Mobile hamburger menu trigger
 * - User avatar + dropdown (profile, sign out)
 * - Glassmorphism backdrop with smooth transitions
 */

"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, LogOut, User, Shield } from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, role, handleSignOut } = useAuth();
  const router = useRouter();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  async function onSignOut() {
    await handleSignOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 anim-fade-in-down">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover-press"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Brand */}
        <Link
          href="/dashboard"
          className="group flex items-center gap-2.5 font-bold text-lg"
        >
          <span className="text-xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:drop-shadow-lg">🏠</span>
          <span className="hidden sm:inline relative">
            <span className="bg-gradient-to-r from-[oklch(0.42_0.10_130)] via-[oklch(0.55_0.08_90)] to-[oklch(0.72_0.09_42)] bg-clip-text text-transparent font-extrabold tracking-tight">
              FixMyDorm
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.88_0.065_42)] group-hover:w-full transition-all duration-500 rounded-full" />
          </span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Role Badge */}
        {role && (
          <Badge
            variant={role === "management" ? "default" : "secondary"}
            className="hidden sm:flex items-center gap-1 anim-pop-subtle delay-300 hover-press"
          >
            {role === "management" ? (
              <Shield className="h-3 w-3" />
            ) : (
              <User className="h-3 w-3" />
            )}
            {role === "management" ? "Management" : "Student"}
          </Badge>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-accent/50 transition-all duration-300 hover:ring-2 hover:ring-primary/20 hover:scale-110"
          >
            <Avatar className="h-9 w-9 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <AvatarFallback className="bg-gradient-to-br from-[oklch(0.42_0.10_130)] to-[oklch(0.55_0.08_130)] text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 anim-pop-subtle glass">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {user?.hostelName && (
              <DropdownMenuItem disabled>
                🏢 {user.hostelName}
                {user.roomNumber ? ` · Room ${user.roomNumber}` : ""}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onSignOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
