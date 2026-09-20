/**
 * FixMyDorm - Student Dashboard
 *
 * Premium dashboard built from Stitch design — wired to real auth & complaints API.
 * Features: stats, complaint list with priority bars, hostel health widget,
 * voice note modal, emergency contact.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import Link from "next/link";
import type { Complaint } from "@/types";
import { timeAgo } from "@/lib/utils";
import { PRIORITY_CONFIG } from "@/lib/constants";

/* ─── Voice Modal ─────────────────────────────────────────────────────────── */
function VoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!open) { setSeconds(0); return; }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [open]);

  const fmt = (n: number) =>
    `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive animate-ping" />
            <h3 className="font-semibold text-lg text-foreground">Voice Grievance Logger</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="py-6 flex flex-col items-center space-y-4 text-center">
          <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-9 h-9 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            <div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold font-mono text-primary">{fmt(seconds)}</span>
            <p className="text-sm text-muted-foreground">Speak clearly: Describe the fixture, room section, and urgency.</p>
          </div>
        </div>

        <div className="bg-muted p-3 rounded-lg text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-1">Live Audio Transcription</span>
          <p className="text-sm text-muted-foreground italic">&ldquo;The study light regulator is making a continuous humming noise...&rdquo;</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 text-sm font-medium transition-colors">
            Discard
          </button>
          <Link
            href={`/complaints/new?voice=true&transcription=${encodeURIComponent("The study light regulator is making a continuous humming noise...")}`}
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Convert to Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Priority bar colours ────────────────────────────────────────────────── */
const PRIORITY_BARS: Record<string, string> = {
  critical: "bg-destructive",
  high:     "bg-orange-500",
  medium:   "bg-amber-400",
  low:      "bg-primary",
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  submitted:    { label: "Submitted",    cls: "bg-blue-100 text-blue-700" },
  under_review: { label: "Under Review", cls: "bg-purple-100 text-purple-700" },
  assigned:     { label: "Assigned",     cls: "bg-indigo-100 text-indigo-700" },
  in_progress:  { label: "In Progress",  cls: "bg-amber-100 text-amber-700" },
  resolved:     { label: "Resolved",     cls: "bg-green-100 text-green-700" },
  closed:       { label: "Closed",       cls: "bg-muted text-muted-foreground" },
  rejected:     { label: "Rejected",     cls: "bg-red-100 text-red-700" },
};

/* ─── Dashboard ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const fetchComplaints = useCallback(async () => {
    try {
      const res = await fetch("/api/complaints");
      if (!res.ok) return;
      const data = await res.json();
      setComplaints(data.complaints ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const total    = complaints.length;
  const pending  = complaints.filter((c) =>
    ["submitted", "under_review", "assigned", "in_progress"].includes(c.status)
  ).length;
  const resolved = complaints.filter((c) =>
    ["resolved", "closed"].includes(c.status)
  ).length;
  const recent   = complaints.slice(0, 4);

  return (
    <>
      <VoiceModal open={voiceOpen} onClose={() => setVoiceOpen(false)} />

      <div className="space-y-5 max-w-7xl mx-auto w-full pb-10">

        {/* ── Campus Alert Ticker ───────────────────────────────────────── */}
        {!alertDismissed && (
          <div className="w-full bg-accent/40 rounded-xl p-3 px-4 flex items-center justify-between shadow-sm hover:bg-accent/60 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse shrink-0" />
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Campus Alert</span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-sm text-foreground truncate">
                  Scheduled RO Water Filter maintenance in Wing B today, 2:00 PM – 4:00 PM. Alternate taps on 1st floor available.
                </span>
              </div>
            </div>
            <button onClick={() => setAlertDismissed(true)} className="text-muted-foreground hover:text-foreground ml-3 shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* ── Welcome Header ────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card p-6 rounded-xl shadow-sm border">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {firstName}</h1>
              <span className="text-2xl animate-bounce inline-block origin-bottom-right">👋</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {user?.hostelName && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-sm text-foreground">
                  🏠 <span>{user.hostelName}</span>
                </div>
              )}
              {user?.roomNumber && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-full text-sm text-foreground">
                  🚪 <span>Room {user.roomNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-1 px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">
                ✓ Resident Verified
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setVoiceOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-accent text-foreground rounded-lg transition-colors text-sm font-medium shadow-sm"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
              </span>
              🎙 Quick Voice Note
            </button>
            <Link
              href="/wall"
              className="flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-accent text-foreground rounded-lg transition-colors text-sm font-medium"
            >
              📢 The Wall
              <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">14</span>
            </Link>
            <Link
              href="/complaints/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg shadow-sm transition-all text-sm font-medium hover:opacity-90 active:scale-95"
            >
              ＋ File New Grievance
            </Link>
          </div>
        </div>

        {/* ── Stats Cards ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total */}
          <div className="relative overflow-hidden bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Total Complaints Filed</span>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-5xl font-bold text-foreground tracking-tight">{loading ? "—" : total}</span>
                  <span className="text-xs text-muted-foreground">all-time</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                📋
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center gap-2">
              <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <span className="text-xs font-bold">↑ +2 this month</span>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          </div>

          {/* Pending */}
          <div className="relative overflow-hidden bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Pending Action</span>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-5xl font-bold text-orange-500 tracking-tight">{loading ? "—" : pending}</span>
                  <span className="text-xs text-muted-foreground">active tickets</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                ⏳
              </div>
            </div>
            <div className="mt-4 pt-3">
              <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                <span className="text-xs font-bold">Needs attention</span>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-orange-500/5 blur-2xl pointer-events-none" />
          </div>

          {/* Resolved */}
          <div className="relative overflow-hidden bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Resolved Issues</span>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-5xl font-bold text-primary tracking-tight">{loading ? "—" : resolved}</span>
                  <span className="text-xs text-muted-foreground">closed out</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                ✅
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center gap-2">
              <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <span className="text-xs font-bold">⚡ Avg. 3.8 hrs</span>
              </div>
              <span className="text-xs text-muted-foreground">resolution time</span>
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          </div>
        </div>

        {/* ── Main Grid: Complaints + Right Panel ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* Left: Complaint List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <span className="text-lg font-bold text-foreground">Recent Complaints</span>
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold">{recent.length} Loaded</span>
              </div>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <span className="px-2.5 py-1 rounded bg-card text-primary text-xs font-semibold shadow-sm">All</span>
                <Link href="/complaints" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground text-xs">Active ({pending})</Link>
                <Link href="/complaints" className="px-2.5 py-1 rounded text-muted-foreground hover:text-foreground text-xs">Resolved</Link>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {loading && (
                <div className="text-center py-12 text-muted-foreground text-sm">Loading your complaints...</div>
              )}

              {!loading && recent.length === 0 && (
                <div className="text-center py-12 bg-card border rounded-xl">
                  <p className="text-4xl mb-3">🎉</p>
                  <p className="font-semibold text-foreground">No complaints yet!</p>
                  <p className="text-sm text-muted-foreground mt-1">Your hostel experience is clean. File one if something needs fixing.</p>
                  <Link href="/complaints/new" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                    File First Grievance
                  </Link>
                </div>
              )}

              {!loading && recent.map((complaint) => {
                const priorityBar = PRIORITY_BARS[complaint.priority] ?? "bg-muted";
                const status = STATUS_LABELS[complaint.status] ?? { label: complaint.status, cls: "bg-muted text-muted-foreground" };
                return (
                  <div key={complaint.id} className="relative overflow-hidden bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                    {/* Priority bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${priorityBar} rounded-l-xl`} />

                    <div className="pl-3 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${status.cls}`}>
                              {status.label}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-semibold capitalize">
                              {complaint.category}
                            </span>
                            <span className="text-xs text-muted-foreground">#{complaint.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                          <h3 className="font-semibold text-base text-foreground pt-1">{complaint.title}</h3>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{timeAgo(complaint.createdAt)}</span>
                      </div>

                      {complaint.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{complaint.description}</p>
                      )}

                      <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                          <span className="text-xs font-medium text-foreground">Priority:</span>
                          <span className="text-xs font-bold text-foreground capitalize">{complaint.priority}</span>
                        </div>
                        <Link
                          href={`/complaints/${complaint.id}`}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                        >
                          View Timeline →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            {!loading && total > 4 && (
              <div className="flex items-center justify-between pt-2 px-1">
                <span className="text-xs text-muted-foreground">Showing 4 of {total} registered records</span>
                <Link href="/complaints" className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-semibold transition-colors">
                  View All Historical Slips →
                </Link>
              </div>
            )}
          </div>

          {/* Right: Live Health + Emergency (4 cols) */}
          <div className="lg:col-span-4 space-y-4">

            {/* Hostel Live Health */}
            <div className="bg-card border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>💚</span>
                  <h3 className="font-bold text-base text-foreground">Hostel Live Health</h3>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Live Sync
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Campus Wi-Fi (Wing B)", icon: "📶", value: "98%", bar: 98, sub: ["Speed: 142 Mbps", "Latency: 12ms"], color: "bg-primary" },
                  { label: "Overhead Water Supply", icon: "💧", value: "85%", bar: 85, sub: ["Rooftop Tanks A/B", "Pressurized"], color: "bg-blue-500" },
                  { label: "Basement Laundromat", icon: "🧺", value: "4 Free", bar: 60, sub: ["6 units total", "2 in rinse"], color: "bg-secondary" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <span className="font-bold text-primary text-xs">{item.value}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className={`${item.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${item.bar}%` }} />
                    </div>
                    <div className="flex justify-between text-muted-foreground text-xs pt-0.5">
                      <span>{item.sub[0]}</span>
                      <span>{item.sub[1]}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/mess-menu" className="w-full py-2 bg-muted hover:bg-accent rounded-lg text-primary text-sm font-semibold transition-colors flex items-center justify-center gap-1.5">
                📊 View Full Amenities Grid
              </Link>
            </div>

            {/* Campus Facility Photo */}
            <div className="bg-card border rounded-xl p-4 shadow-sm space-y-3">
              <div className="relative w-full h-36 rounded-lg overflow-hidden bg-muted">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center">
                  <span className="text-5xl">🏫</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">Hostel Quadrangle • Cleanliness Drive Sat 9 AM</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Join the student welfare council for weekly waste segregation feedback and tree plantation along the East Gate corridor.
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span>🚨</span>
                <h4 className="font-bold text-base text-foreground">Emergency Warden Support</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                For critical after-hours plumbing leaks, power hazards, or safety concerns, call the warden desk directly:
              </p>
              <a
                href="tel:+919876543210"
                className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-muted transition-colors shadow-sm border"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center text-lg">
                    📞
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">+91 98765 43210</div>
                    <div className="text-xs text-muted-foreground">24×7 Control Room</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
