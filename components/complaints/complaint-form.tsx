/**
 * FixMyDorm - Complaint Submission Form
 *
 * Full form for submitting a new complaint:
 * - Title & description
 * - Image upload
 * - AI auto-classification (category + priority)
 * - Manual override for category & priority
 * - Location details
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageUpload } from "@/components/complaints/image-upload";
import { COMPLAINT_CATEGORIES, PRIORITY_CONFIG } from "@/lib/constants";
import {
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  Building,
  DoorOpen,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { ComplaintCategory, Priority } from "@/types";

export function ComplaintForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ComplaintCategory>("other");
  const [priority, setPriority] = useState<Priority>("medium");
  const [hostelName, setHostelName] = useState(user?.hostelName || "");
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || "");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [complaintId] = useState(uuidv4()); // Pre-generate for image uploads
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<{
    category?: string;
    priority?: string;
    confidence?: number;
  } | null>(null);

  const handleImagesChange = useCallback((urls: string[]) => {
    setImageUrls(urls);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user?.userId,
          title,
          description,
          category,
          priority,
          hostelName,
          roomNumber: roomNumber || undefined,
          imageUrls,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to submit complaint");
      }

      // Show AI suggestion if it differs from manual selection
      if (data.classification) {
        setAiSuggestion({
          category: data.classification.aiCategory,
          priority: data.classification.aiPriority,
          confidence: data.classification.confidence,
        });
      }

      // Redirect to complaint detail
      router.push(`/complaints/${data.data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Submit a Complaint</CardTitle>
        <CardDescription>
          Describe your issue and we&apos;ll route it to the right team. AI will
          help categorize and prioritize it.
        </CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className="space-y-6">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* AI Suggestion Banner */}
          {aiSuggestion && aiSuggestion.confidence && aiSuggestion.confidence > 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <p>
                AI suggests: <strong>{aiSuggestion.category}</strong> priority{" "}
                <strong>{aiSuggestion.priority}</strong> (
                {Math.round((aiSuggestion.confidence || 0) * 100)}% confident)
              </p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="complaint-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="complaint-title"
              placeholder="Brief summary of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="complaint-description">
              Description <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="complaint-description"
              placeholder="Describe the issue in detail. Include when it started, how it affects you, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSubmitting}
              rows={5}
              maxLength={2000}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/2000
            </p>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="complaint-category">Category</Label>
              <select
                id="complaint-category"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ComplaintCategory)
                }
                disabled={isSubmitting}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Object.entries(COMPLAINT_CATEGORIES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI will auto-suggest on submit
              </p>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  Object.entries(PRIORITY_CONFIG) as [
                    Priority,
                    (typeof PRIORITY_CONFIG)[Priority],
                  ][]
                ).map(([value, config]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    disabled={isSubmitting}
                    className={`rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition-all ${
                      priority === value
                        ? "border-current"
                        : "border-border hover:border-current/30"
                    }`}
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complaint-hostel">Hostel</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="complaint-hostel"
                  placeholder="Hostel name"
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  className="pl-9"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="complaint-room">Room No.</Label>
              <div className="relative">
                <DoorOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="complaint-room"
                  placeholder="e.g., 204"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="pl-9"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photos (optional)</Label>
            <ImageUpload
              complaintId={complaintId}
              maxFiles={3}
              onImagesChange={handleImagesChange}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !title || !description}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Submit Complaint
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
