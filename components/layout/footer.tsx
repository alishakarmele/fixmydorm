/**
 * FixMyDorm - Footer Component
 */

import { APP_NAME, APP_VERSION } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-background py-3 px-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {APP_NAME}</p>
        <p className="font-mono">v{APP_VERSION}</p>
      </div>
    </footer>
  );
}
