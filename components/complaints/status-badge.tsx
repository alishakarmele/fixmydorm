/**
 * FixMyDorm - Status Badge Component
 *
 * Colored badge showing complaint status.
 */

import { Badge } from "@/components/ui/badge";
import { COMPLAINT_STATUSES } from "@/lib/constants";
import type { ComplaintStatus } from "@/types";

const STATUS_STYLES: Record<ComplaintStatus, string> = {
  submitted: "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400",
  under_review: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400",
  assigned: "bg-purple-500/10 text-purple-700 border-purple-200 dark:text-purple-400",
  in_progress: "bg-orange-500/10 text-orange-700 border-orange-200 dark:text-orange-400",
  resolved: "bg-green-500/10 text-green-700 border-green-200 dark:text-green-400",
  closed: "bg-gray-500/10 text-gray-700 border-gray-200 dark:text-gray-400",
  rejected: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400",
};

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${STATUS_STYLES[status] || ""} ${className || ""}`}
    >
      {COMPLAINT_STATUSES[status] || status}
    </Badge>
  );
}
