/**
 * FixMyDorm - My Complaints Page
 *
 * Shows the student's complaint list with status filtering.
 * Links to submit new complaint.
 * ✦ Premium: stagger animation, gradient header, animated filters
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { ComplaintCard } from "@/components/complaints/complaint-card";
import { COMPLAINT_STATUSES } from "@/lib/constants";
import { Plus, Loader2, Inbox } from "lucide-react";
import type { Complaint, ComplaintStatus } from "@/types";

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ComplaintStatus | "all">(
    "all"
  );

  const fetchComplaints = useCallback(async () => {
    if (!user?.userId) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams({ studentId: user.userId });
      const res = await fetch(`/api/complaints?${params}`);
      const data = await res.json();

      if (data.success) {
        setComplaints(data.data as Complaint[]);
      }
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints =
    activeFilter === "all"
      ? complaints
      : complaints.filter((c) => c.status === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between anim-fade-in-up">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.55_0.08_130)] bg-clip-text text-transparent">My Complaints</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage your hostel complaints
          </p>
        </div>
        <Link href="/complaints/new">
          <Button className="bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.35_0.08_130)] text-white hover:shadow-lg hover:shadow-[oklch(0.42_0.10_130/0.25)] transition-all duration-400 hover:scale-105 hover:-translate-y-0.5">
            <Plus className="mr-2 h-4 w-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 anim-fade-in-up delay-100">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-400 hover:scale-105 ${
            activeFilter === "all"
              ? "bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.35_0.08_130)] text-white shadow-md shadow-[oklch(0.42_0.10_130/0.2)]"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          All ({complaints.length})
        </button>
        {(Object.entries(COMPLAINT_STATUSES) as [ComplaintStatus, string][]).map(
          ([value, label]) => {
            const count = complaints.filter((c) => c.status === value).length;
            if (count === 0) return null;
            return (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-400 hover:scale-105 ${
                  activeFilter === value
                    ? "bg-gradient-to-r from-[oklch(0.42_0.10_130)] to-[oklch(0.35_0.08_130)] text-white shadow-md shadow-[oklch(0.42_0.10_130/0.2)]"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {label} ({count})
              </button>
            );
          }
        )}
      </div>

      {/* Complaints List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center anim-fade-in-scale">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Inbox className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="font-bold text-lg">No complaints found</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {activeFilter === "all"
              ? "You haven't submitted any complaints yet. Click \"New Complaint\" to get started."
              : `No complaints with status "${COMPLAINT_STATUSES[activeFilter]}".`}
          </p>
          {activeFilter === "all" && (
            <Link href="/complaints/new" className="mt-4">
              <Button variant="outline" className="hover:scale-105 transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                Submit Your First Complaint
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3 stagger-children">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
}
