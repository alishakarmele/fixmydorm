/**
 * FixMyDorm - Protected Layout
 *
 * Route group layout for all authenticated pages.
 * Renders navbar + sidebar + main content + footer.
 * Auth check is handled by middleware.ts — this layout
 * just provides the visual shell.
 *
 * ✦ Premium: floating ambient blobs, grain texture, smooth transitions
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
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient floating blobs for depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="anim-float-gentle absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full blur-[130px] bg-[oklch(0.42_0.10_130/0.05)]" />
        <div className="anim-float-slow absolute bottom-[15%] left-[8%] w-[280px] h-[280px] rounded-full blur-[110px] bg-[oklch(0.88_0.065_42/0.06)]" />
        <div className="anim-float-drift absolute top-[60%] right-[30%] w-[200px] h-[200px] rounded-full blur-[100px] bg-[oklch(0.55_0.08_130/0.04)]" />
      </div>

      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

      <div className="relative z-10 flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar (Sheet) */}
        <MobileSidebar
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 anim-fade-in-up">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
