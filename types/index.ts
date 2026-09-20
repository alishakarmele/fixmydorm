/**
 * FixMyDorm - Shared TypeScript type definitions
 *
 * This file contains all shared types used across the application.
 * Types are organized by feature domain.
 */

// ============================================================================
// User & Auth Types
// ============================================================================

/** User roles within the platform */
export type UserRole = "student" | "management";

/** Base user profile from Cognito */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  hostelName?: string;
  roomNumber?: string;
  createdAt: string;
}

// ============================================================================
// Complaint / Grievance Types
// ============================================================================

/** Complaint categories auto-assigned by AI */
export type ComplaintCategory =
  | "plumbing"
  | "electrical"
  | "furniture"
  | "cleanliness"
  | "pest_control"
  | "internet"
  | "security"
  | "noise"
  | "mess_food"
  | "other";

/** Priority levels auto-assigned by AI */
export type Priority = "critical" | "high" | "medium" | "low";

/** Lifecycle status of a complaint */
export type ComplaintStatus =
  | "submitted"
  | "under_review"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed"
  | "rejected";

/** A single complaint record */
export interface Complaint {
  id: string;
  studentId: string;
  studentName?: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: Priority;
  status: ComplaintStatus;
  hostelName: string;
  roomNumber?: string;
  imageUrls: string[];
  assignedTo?: string;
  managementResponse?: string;
  duplicateOf?: string;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// The Wall (Anonymous Grievance Board) Types
// ============================================================================

/** An anonymous post on The Wall */
export interface WallPost {
  id: string;
  content: string;
  category: ComplaintCategory;
  upvotes: number;
  affectedCount: number;
  officialResponse?: string;
  isModerated: boolean;
  createdAt: string;
}

// ============================================================================
// Lost & Found Types
// ============================================================================

export type LostFoundStatus = "open" | "claimed" | "returned" | "expired";
export type LostFoundType = "lost" | "found";

/** A lost or found item report */
export interface LostFoundItem {
  id: string;
  reporterId: string;
  type: LostFoundType;
  title: string;
  description: string;
  category: string;
  location: string;
  imageUrls: string[];
  status: LostFoundStatus;
  matchedItemId?: string;
  claimedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Early Leave / Late Entry Types
// ============================================================================

export type LeaveRequestStatus = "pending" | "approved" | "rejected";

/** A request for early leave or late entry */
export interface LeaveRequest {
  id: string;
  studentId: string;
  type: "early_leave" | "late_entry";
  reason: string;
  eventName?: string;
  requestedDate: string;
  requestedTime: string;
  status: LeaveRequestStatus;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Mess Menu Types
// ============================================================================

export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";

/** A single meal entry */
export interface MealItem {
  type: MealType;
  items: string[];
}

/** Daily menu for the mess */
export interface DailyMenu {
  id: string;
  date: string;
  day: string;
  meals: MealItem[];
  averageRating?: number;
  totalRatings?: number;
}

/** Feedback on a specific meal */
export interface MealFeedback {
  id: string;
  studentId: string;
  menuId: string;
  mealType: MealType;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/** Standard API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Paginated response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  lastEvaluatedKey?: string;
  totalCount?: number;
}
