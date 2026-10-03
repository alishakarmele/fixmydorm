/**
 * FixMyDorm - Complaint Card Component
 *
 * Reusable card for displaying a complaint in a list.
 * Shows title, category badge, priority badge, status, and time.
 * ✦ Premium: hover lift, gradient border reveal, smooth transitions
 */

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/complaints/status-badge";
import { COMPLAINT_CATEGORIES, PRIORITY_CONFIG } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Complaint } from "@/types";
import { Clock, MapPin, ImageIcon, ArrowUpRight } from "lucide-react";

interface ComplaintCardProps {
  complaint: Complaint;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const priorityConfig = PRIORITY_CONFIG[complaint.priority];
  const categoryLabel =
    COMPLAINT_CATEGORIES[complaint.category] || complaint.category;

  return (
    <Link href={`/complaints/${complaint.id}`}>
      <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[oklch(0.42_0.10_130/0.06)] hover:border-primary/20 hover:-translate-y-1.5 cursor-pointer hover-gradient-border">
        {/* Hover glow spot */}
        <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-[oklch(0.42_0.10_130/0.06)] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-600 group-hover:scale-200 pointer-events-none" />

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-tight truncate group-hover:text-primary transition-colors duration-300">
                {complaint.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {complaint.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={complaint.status} />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-primary/60 transition-all duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Badge */}
            <Badge variant="secondary" className="text-xs transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
              {categoryLabel}
            </Badge>

            {/* Priority Badge */}
            <Badge
              variant="outline"
              className="text-xs transition-all duration-300"
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
