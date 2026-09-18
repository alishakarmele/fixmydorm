/**
 * FixMyDorm - Complaint Detail Page
 *
 * Shows full complaint details:
 * - Title, description, images
 * - Status timeline
 * - Category, priority, location
 * - Management response (if any)
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { COMPLAINT_CATEGORIES, PRIORITY_CONFIG } from "@/lib/constants";
import { formatDate, timeAgo } from "@/lib/utils";
import type { Complaint } from "@/types";
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
} from "lucide-react";

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchComplaint() {
      try {
        const res = await fetch(`/api/complaints/${params.id}`);
        const data = await res.json();

        if (data.success) {
          setComplaint(data.data as Complaint);
        } else {
          setError(data.error || "Complaint not found");
        }
      } catch {
        setError("Failed to load complaint");
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchComplaint();
    }
  }, [params.id]);

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
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const priorityConfig = PRIORITY_CONFIG[complaint.priority];
  const categoryLabel =
    COMPLAINT_CATEGORIES[complaint.category] || complaint.category;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/complaints">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Complaints
        </Button>
      </Link>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl">{complaint.title}</CardTitle>
              <CardDescription className="mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(complaint.createdAt)} ·{" "}
                  {timeAgo(complaint.createdAt)}
                </span>
                {complaint.hostelName && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {complaint.hostelName}
                    {complaint.roomNumber
                      ? ` · Room ${complaint.roomNumber}`
                      : ""}
                  </span>
                )}
              </CardDescription>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {categoryLabel}
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1"
              style={{
                borderColor: priorityConfig.color,
                color: priorityConfig.color,
              }}
            >
              <AlertTriangle className="h-3 w-3" />
              {priorityConfig.label} Priority
            </Badge>
            {complaint.duplicateOf && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                Possible Duplicate
              </Badge>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-sm mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Images */}
          {complaint.imageUrls.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  Photos ({complaint.imageUrls.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {complaint.imageUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden border bg-muted aspect-square hover:opacity-90 transition-opacity"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Complaint photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Management Response */}
          {complaint.managementResponse && (
            <>
              <Separator />
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Management Response
                </h3>
                <p className="text-sm whitespace-pre-wrap">
                  {complaint.managementResponse}
                </p>
                {complaint.assignedTo && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Assigned to: {complaint.assignedTo}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Metadata Footer */}
          <Separator />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>ID: {complaint.id.slice(0, 8)}…</span>
            <span>
              Last updated: {formatDate(complaint.updatedAt)} ·{" "}
              {timeAgo(complaint.updatedAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
