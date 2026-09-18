/**
 * FixMyDorm - Protected Layout
 *
 * Route group layout for all authenticated pages.
 * Renders navbar + sidebar + main content + footer.
 * Auth check is handled by middleware.ts — this layout
 * just provides the visual shell.
 */

"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar (Sheet) */}
        <MobileSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
