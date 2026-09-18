/**
 * FixMyDorm - Leave Requests Page
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, timeAgo } from "@/lib/utils";
import {
  DoorOpen,
  Plus,
  X,
  Send,
  Loader2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  type: "early_leave" | "late_entry";
  reason: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "rejected";
  approvedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

const STATUS_ICONS = {
  pending: Hourglass,
  approved: CheckCircle2,
  rejected: XCircle,
};

const STATUS_COLORS = {
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30",
  approved: "text-green-600 bg-green-50 border-green-200 dark:bg-green-950/30",
  rejected: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/30",
};

export default function LeaveRequestsPage() {
  const { user, role } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formType, setFormType] = useState<"early_leave" | "late_entry">("early_leave");
  const [formReason, setFormReason] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      const params = role === "management" ? "" : `?studentId=${user?.userId}`;
      const res = await fetch(`/api/leave-requests${params}`);
      const data = await res.json();
      if (data.success) setRequests(data.data as LeaveRequest[]);
    } catch {
      console.error("Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId, role]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPosting(true);
    setError("");

    try {
      const res = await fetch("/api/leave-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user?.userId,
          studentName: user?.name,
          type: formType,
          reason: formReason,
          date: formDate,
          time: formTime,
          hostelName: user?.hostelName,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => [data.data as LeaveRequest, ...prev]);
        setShowForm(false);
        setFormReason("");
        setFormDate("");
        setFormTime("");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to submit");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <DoorOpen className="h-6 w-6" />
            Leave Requests
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {role === "management" ? "Review student leave requests" : "Request early leave or late entry"}
          </p>
        </div>
        {role === "student" && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {showForm ? "Cancel" : "New Request"}
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-primary/20">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-4 space-y-3">
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {(["early_leave", "late_entry"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormType(t)}
                    className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                      formType === t ? "border-primary bg-primary/5 text-primary" : "border-border"
                    }`}
                  >
                    {t === "early_leave" ? "🚶 Early Leave" : "🌙 Late Entry"}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Reason</Label>
                <textarea
                  placeholder="Why do you need early leave / late entry?"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  rows={2}
                  required
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Time</Label>
                  <Input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPosting}>
                {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit Request
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Requests List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16">
          <DoorOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold">No leave requests</h3>
          <p className="text-muted-foreground text-sm mt-1">
            {role === "student" ? "Submit a request when you need one." : "No pending requests."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const StatusIcon = STATUS_ICONS[req.status];
            return (
              <Card key={req.id}>
                <CardContent className="py-3">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg p-2 border ${STATUS_COLORS[req.status]}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {req.type === "early_leave" ? "Early Leave" : "Late Entry"}
                        </Badge>
                        <Badge variant={req.status === "approved" ? "default" : req.status === "rejected" ? "destructive" : "secondary"} className="text-xs capitalize">
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">{req.reason}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {req.date}
                        </span>
                        {req.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {req.time}
                          </span>
                        )}
                        <span>{timeAgo(req.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
