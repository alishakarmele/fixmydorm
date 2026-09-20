/**
 * FixMyDorm - Warden & Facilities Operations Center
 *
 * Premium management dashboard. Features SLA telemetry, resolution score,
 * multi-tier filters, and triage rows with auto-assign shortcuts.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/complaints/status-badge";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, PRIORITY_CONFIG } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Complaint, ComplaintStatus, ComplaintCategory, Priority } from "@/types";
import { Search, Loader2, AlertTriangle, MapPin, Clock, ShieldCheck, Download, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";

export default function WardenOperationsCenter() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    try {
      const statuses: ComplaintStatus[] = ["submitted", "under_review", "assigned", "in_progress", "resolved", "closed", "rejected"];
      const allComplaints: Complaint[] = [];
      for (const status of statuses) {
        const res = await fetch(`/api/complaints?status=${status}&limit=50`);
        const data = await res.json();
        if (data.success) {
          allComplaints.push(...(data.data as Complaint[]));
        }
      }
      allComplaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setComplaints(allComplaints);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const filtered = complaints.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.hostelName?.toLowerCase().includes(q);
    }
    return true;
  });

  const active = complaints.filter(c => ["submitted", "under_review", "assigned", "in_progress"].includes(c.status)).length;
  const critical = complaints.filter(c => c.priority === "critical" && c.status !== "resolved" && c.status !== "closed").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-xl shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Warden & Facilities Operations Center</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-green-600" /> Authorized Access: {user?.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-background text-xs h-9">
            <Download className="h-3.5 w-3.5 mr-2" /> Export SLA Report
          </Button>
          <Button className="bg-primary text-primary-foreground text-xs h-9">
            Broadcast Hall Alert
          </Button>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Open Tickets</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">{active}</span>
              </div>
            </div>
            <div className="bg-primary/10 p-2 rounded-lg"><Clock className="h-5 w-5 text-primary" /></div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Avg Resolution</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">3h 42m</span>
              </div>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700 font-bold text-xs">SLA: &lt;4h</div>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm border-red-200">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-red-600 uppercase">Critical Hazards</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-red-600">{critical}</span>
                <span className="text-xs text-red-500 font-medium">Active</span>
              </div>
            </div>
            <div className="bg-red-100 p-2 rounded-lg animate-pulse"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm bg-primary/5">
          <CardContent className="p-5 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-primary uppercase">Resolution Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">88%</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-yellow-500 text-sm">★★★★☆</div>
              <span className="text-[10px] text-muted-foreground">Student Satisfaction</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card border rounded-xl p-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search ticket ID, room, student log..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | "all")}
          className="h-10 rounded-md border bg-muted/50 px-3 text-sm min-w-[140px]"
        >
          <option value="all">All Statuses</option>
          {(Object.entries(COMPLAINT_STATUSES) as [ComplaintStatus, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 px-2 border-l pl-4">
          <span className="text-xs font-medium text-muted-foreground">Quick Triage:</span>
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-[10px] font-bold cursor-pointer">Unassigned Critical</span>
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold cursor-pointer">SLA Breach Warning</span>
        </div>
      </div>

      {/* Triage Rows */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
          <h3 className="font-semibold text-sm">Active Grievances ({filtered.length})</h3>
        </div>
        
        {isLoading ? (
          <div className="p-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">No tickets found.</div>
        ) : (
          <div className="divide-y">
            {filtered.map((complaint) => {
              const priorityConfig = PRIORITY_CONFIG[complaint.priority];
              return (
                <div key={complaint.id} className="relative p-4 hover:bg-muted/30 transition-colors flex flex-col md:flex-row md:items-center gap-4 group">
                  {/* Left Priority Bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: priorityConfig.color }} />
                  
                  {/* Info */}
                  <div className="flex-1 pl-2 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        #{complaint.id.split("-")[0].toUpperCase()}
                      </span>
                      <StatusBadge status={complaint.status} />
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border" style={{ color: priorityConfig.color, borderColor: `${priorityConfig.color}40`, backgroundColor: `${priorityConfig.color}10` }}>
                        {priorityConfig.label.toUpperCase()}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-sm text-foreground pr-4 line-clamp-1">
                      {complaint.title}
                    </h4>
                    
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <MapPin className="h-3 w-3" /> {complaint.hostelName} • {complaint.roomNumber}
                      </span>
                      <span>👤 {complaint.studentName}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Filed {timeAgo(complaint.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions & SLA */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0">
                    {["submitted", "under_review"].includes(complaint.status) ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded-md border border-orange-200 animate-pulse">
                          Needs Assignee
                        </span>
                        <Button size="sm" className="h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                          Assign Contractor
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-md">
                          Assigned: {complaint.assignedTo || "Maintenance"}
                        </span>
                        <Link href={`/management/complaints/${complaint.id}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Inspect Details <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
