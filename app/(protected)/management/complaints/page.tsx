/**
 * FixMyDorm - Management Complaints Page
 *
 * Central dashboard for management to view, filter, assign, and respond
 * to all student complaints.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/complaints/status-badge";
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES,
  PRIORITY_CONFIG,
} from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Complaint, ComplaintStatus, ComplaintCategory, Priority } from "@/types";
import {
  Search,
  Loader2,
  Inbox,
  ClipboardList,
  AlertTriangle,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function ManagementComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ComplaintCategory | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch all complaints (management view)
      const statuses: ComplaintStatus[] = [
        "submitted",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
        "rejected",
      ];

      const allComplaints: Complaint[] = [];
      for (const status of statuses) {
        const res = await fetch(`/api/complaints?status=${status}&limit=50`);
        const data = await res.json();
        if (data.success) {
          allComplaints.push(...(data.data as Complaint[]));
        }
      }

      // Sort by createdAt descending
      allComplaints.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setComplaints(allComplaints);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
    if (priorityFilter !== "all" && c.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.hostelName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(
      (c) => c.status === "submitted" || c.status === "under_review"
    ).length,
    inProgress: complaints.filter(
      (c) => c.status === "assigned" || c.status === "in_progress"
    ).length,
    resolved: complaints.filter(
      (c) => c.status === "resolved" || c.status === "closed"
    ).length,
    critical: complaints.filter((c) => c.priority === "critical").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          All Complaints
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review, assign, and manage student complaints
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Pending", value: stats.pending, color: "text-yellow-600" },
          { label: "In Progress", value: stats.inProgress, color: "text-blue-600" },
          { label: "Critical", value: stats.critical, color: "text-red-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title, description, or hostel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ComplaintStatus | "all")
              }
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="all">All Statuses</option>
              {(Object.entries(COMPLAINT_STATUSES) as [ComplaintStatus, string][]).map(
                ([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                )
              )}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as ComplaintCategory | "all")
              }
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              {Object.entries(COMPLAINT_CATEGORIES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as Priority | "all")
              }
              className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm"
            >
              <option value="all">All Priorities</option>
              {(Object.entries(PRIORITY_CONFIG) as [Priority, { label: string }][]).map(
                ([value, config]) => (
                  <option key={value} value={value}>{config.label}</option>
                )
              )}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold">No complaints match your filters</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Try adjusting the filters above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {complaints.length} complaints
          </p>

          {filtered.map((complaint) => {
            const priorityConfig = PRIORITY_CONFIG[complaint.priority];
            return (
              <Link
                key={complaint.id}
                href={`/management/complaints/${complaint.id}`}
              >
                <Card className="transition-all hover:shadow-md hover:border-primary/20 cursor-pointer mb-2">
                  <CardContent className="py-3">
                    <div className="flex items-center gap-4">
                      {/* Priority Indicator */}
                      <div
                        className="w-1 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: priorityConfig.color }}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">
                            {complaint.title}
                          </h3>
                          {complaint.priority === "critical" && (
                            <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {complaint.hostelName && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {complaint.hostelName}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(complaint.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                          {COMPLAINT_CATEGORIES[complaint.category] || complaint.category}
                        </Badge>
                        <StatusBadge status={complaint.status} />
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
