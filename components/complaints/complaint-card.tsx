/**
 * FixMyDorm - Complaint Card Component
 *
 * Reusable card for displaying a complaint in a list.
 * Shows title, category badge, priority badge, status, and time.
 */

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/complaints/status-badge";
import { COMPLAINT_CATEGORIES, PRIORITY_CONFIG } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Complaint } from "@/types";
import { Clock, MapPin, ImageIcon } from "lucide-react";

interface ComplaintCardProps {
  complaint: Complaint;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const priorityConfig = PRIORITY_CONFIG[complaint.priority];
  const categoryLabel =
    COMPLAINT_CATEGORIES[complaint.category] || complaint.category;

  return (
    <Link href={`/complaints/${complaint.id}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight truncate">
                {complaint.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {complaint.description}
              </p>
            </div>
            <StatusBadge status={complaint.status} />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Badge */}
            <Badge variant="secondary" className="text-xs">
              {categoryLabel}
            </Badge>

            {/* Priority Badge */}
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: priorityConfig.color,
                color: priorityConfig.color,
              }}
            >
              {priorityConfig.label}
            </Badge>

            {/* Image indicator */}
            {complaint.imageUrls.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ImageIcon className="h-3 w-3" />
                {complaint.imageUrls.length}
              </span>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Location */}
            {complaint.hostelName && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {complaint.hostelName}
                {complaint.roomNumber ? ` · ${complaint.roomNumber}` : ""}
              </span>
            )}

            {/* Time */}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeAgo(complaint.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
