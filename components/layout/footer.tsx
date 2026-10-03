/**
 * FixMyDorm - Footer Component
 * Premium footer with gradient accent and smooth hover
 */

import { APP_NAME, APP_VERSION } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative border-t bg-background/80 backdrop-blur-sm py-3 px-6 overflow-hidden">
      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <span className="opacity-60">©</span> {new Date().getFullYear()} {APP_NAME}
          <span className="opacity-30">·</span>
          <span className="opacity-40">Built with ❤️ on AWS</span>
        </p>
        <p className="font-mono opacity-50 hover:opacity-100 transition-opacity duration-300">v{APP_VERSION}</p>
      </div>
    </footer>
  );
}
