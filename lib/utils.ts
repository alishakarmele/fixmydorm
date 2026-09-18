/**
 * FixMyDorm - Utility functions
 *
 * Shared helper functions used across the application.
 */

/**
 * Combines multiple class names, filtering out falsy values.
 * Lightweight alternative to `clsx` — can be swapped later if needed.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats an ISO date string into a human-readable format.
 * Uses Indian locale by default (dd/mm/yyyy).
 */
export function formatDate(
  isoString: string,
  locale: string = "en-IN"
): string {
  return new Date(isoString).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns a relative time string (e.g., "2 hours ago").
 */
export function timeAgo(isoString: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 1000
  );

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

/**
 * Truncates a string to the specified length, appending "…" if trimmed.
 */
export function truncate(str: string, maxLength: number = 100): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Generates a simple unique ID (for client-side use only).
 * Backend IDs will come from DynamoDB.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
