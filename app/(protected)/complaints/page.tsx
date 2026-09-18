/**
 * FixMyDorm - My Complaints Page
 *
 * Shows the student's complaint list with status filtering.
 * Links to submit new complaint.
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Complaints</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and manage your hostel complaints
          </p>
        </div>
        <Link href="/complaints/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeFilter === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
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
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No complaints found</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">
            {activeFilter === "all"
              ? "You haven't submitted any complaints yet. Click \"New Complaint\" to get started."
              : `No complaints with status "${COMPLAINT_STATUSES[activeFilter]}".`}
          </p>
          {activeFilter === "all" && (
            <Link href="/complaints/new" className="mt-4">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Submit Your First Complaint
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
}
