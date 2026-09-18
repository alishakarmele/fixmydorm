/**
 * FixMyDorm - Application-wide constants
 *
 * Centralizes magic strings, config values, and enumerations
 * used across the application.
 */

// ============================================================================
// Application Metadata
// ============================================================================

export const APP_NAME = "FixMyDorm";
export const APP_DESCRIPTION =
  "AI-powered hostel grievance, maintenance & daily-life platform for college students";
export const APP_VERSION = "0.1.0";

// ============================================================================
// Complaint Categories (display labels)
// ============================================================================

export const COMPLAINT_CATEGORIES = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  furniture: "Furniture",
  cleanliness: "Cleanliness",
  pest_control: "Pest Control",
  internet: "Internet / Wi-Fi",
  security: "Security",
  noise: "Noise",
  mess_food: "Mess / Food",
  other: "Other",
} as const;

// ============================================================================
// Priority Levels (display labels + colors)
// ============================================================================

export const PRIORITY_CONFIG = {
  critical: { label: "Critical", color: "#EF4444" },
  high: { label: "High", color: "#F97316" },
  medium: { label: "Medium", color: "#EAB308" },
  low: { label: "Low", color: "#22C55E" },
} as const;

// ============================================================================
// Complaint Statuses (display labels)
// ============================================================================

export const COMPLAINT_STATUSES = {
  submitted: "Submitted",
  under_review: "Under Review",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
  rejected: "Rejected",
} as const;

// ============================================================================
// Meal Types
// ============================================================================

export const MEAL_TYPES = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snacks: "Snacks",
  dinner: "Dinner",
} as const;

// ============================================================================
// AWS Configuration Keys (values will come from env vars)
// ============================================================================

export const AWS_CONFIG = {
  REGION: process.env.NEXT_PUBLIC_AWS_REGION ?? "ap-south-1",
  COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "",
  COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? "",
  API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "",
  S3_BUCKET: process.env.NEXT_PUBLIC_S3_BUCKET ?? "",
} as const;
