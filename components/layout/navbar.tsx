/**
 * FixMyDorm - Navbar Component
 *
 * Top navigation bar with:
 * - FixMyDorm logo/brand
 * - Mobile hamburger menu trigger
 * - User avatar + dropdown (profile, sign out)
 */

"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-lg"
        >
          <span className="text-xl">🏠</span>
          <span className="hidden sm:inline">FixMyDorm</span>
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Role Badge */}
        {role && (
          <Badge
            variant={role === "management" ? "default" : "secondary"}
            className="hidden sm:flex items-center gap-1"
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
            className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
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
              className="text-destructive focus:text-destructive"
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
