/**
 * FixMyDorm - Management Complaint Detail Page
 *
 * Allows management to view full complaint details and take action:
 * - Update status
 * - Assign to a team member
 * - Write a response
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDate, timeAgo } from "@/lib/utils";
import type { Complaint, ComplaintStatus } from "@/types";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Tag,
  AlertTriangle,
  MessageSquare,
  ImageIcon,
  Loader2,
  FileWarning,
  Send,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

export default function ManagementComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Action states
  const [newStatus, setNewStatus] = useState<ComplaintStatus | "">("");
  const [assignee, setAssignee] = useState("");
  const [response, setResponse] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const res = await fetch(`/api/complaints/${params.id}`);
        const data = await res.json();

        if (data.success) {
          const c = data.data as Complaint;
          setComplaint(c);
          setNewStatus(c.status);
          setAssignee(c.assignedTo || "");
          setResponse(c.managementResponse || "");
        } else {
          setError(data.error || "Complaint not found");
        }
      } catch {
        setError("Failed to load complaint");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) fetchComplaint();
  }, [params.id]);

  async function handleUpdate() {
    if (!complaint) return;
    setIsUpdating(true);
    setUpdateSuccess(false);

    try {
      const updates: Record<string, string> = {};
      if (newStatus && newStatus !== complaint.status) updates.status = newStatus;
      if (assignee && assignee !== complaint.assignedTo) updates.assignedTo = assignee;
      if (response && response !== complaint.managementResponse)
        updates.managementResponse = response;

      if (Object.keys(updates).length === 0) {
        setIsUpdating(false);
        return;
      }

      const res = await fetch(`/api/complaints/${complaint.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (data.success) {
        setComplaint(data.data as Complaint);
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        setError(data.error || "Update failed");
      }
    } catch {
      setError("Failed to update complaint");
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileWarning className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg">{error || "Not found"}</h3>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const priorityConfig = PRIORITY_CONFIG[complaint.priority];
  const categoryLabel = COMPLAINT_CATEGORIES[complaint.category] || complaint.category;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link href="/management/complaints">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Complaints
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Details (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{complaint.title}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(complaint.createdAt)} · {timeAgo(complaint.createdAt)}
                    </span>
                    {complaint.hostelName && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {complaint.hostelName}
                        {complaint.roomNumber ? ` · Room ${complaint.roomNumber}` : ""}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {categoryLabel}
                </Badge>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1"
                  style={{ borderColor: priorityConfig.color, color: priorityConfig.color }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  {priorityConfig.label}
                </Badge>
              </div>

              <Separator />

              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {complaint.description}
              </p>

              {/* Images */}
              {complaint.imageUrls.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      Photos ({complaint.imageUrls.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {complaint.imageUrls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg overflow-hidden border aspect-square hover:opacity-90 transition-opacity"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>ID: {complaint.id.slice(0, 8)}…</span>
                <span>Student: {complaint.studentId.slice(0, 8)}…</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel (1/3) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Take Action</CardTitle>
              <CardDescription className="text-xs">
                Update status, assign, or respond
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Success Banner */}
              {updateSuccess && (
                <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 p-2.5 text-xs text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Updated successfully
                </div>
              )}

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2 py-1 text-xs"
                >
                  {(Object.entries(COMPLAINT_STATUSES) as [ComplaintStatus, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    )
                  )}
                </select>
              </div>

              {/* Assignee */}
              <div className="space-y-1.5">
                <Label className="text-xs">Assign To</Label>
                <div className="relative">
                  <UserCheck className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Name or team"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="h-8 text-xs pl-7"
                  />
                </div>
              </div>

              {/* Response */}
              <div className="space-y-1.5">
                <Label className="text-xs">Response to Student</Label>
                <textarea
                  placeholder="Write a response..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={4}
                  className="flex w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <Button
                onClick={handleUpdate}
                className="w-full"
                size="sm"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                ) : (
                  <Send className="mr-2 h-3 w-3" />
                )}
                Update Complaint
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
