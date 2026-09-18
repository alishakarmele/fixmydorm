/**
 * FixMyDorm - Footer Component
 *
 * Simple footer with copyright and version info.
 */

import { APP_NAME, APP_VERSION } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-background py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {APP_NAME} · Built for WeMakeDevs AWS
          Hackathon
        </p>
        <p className="font-mono">v{APP_VERSION}</p>
      </div>
    </footer>
  );
}
