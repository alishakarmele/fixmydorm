/**
 * FixMyDorm - The Wall Page
 *
 * Anonymous grievance board where students post anonymously,
 * upvote issues, mark "Affected Too", and management can respond officially.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { timeAgo } from "@/lib/utils";
import {
  Megaphone,
  ThumbsUp,
  Users,
  MessageSquare,
  Send,
  Loader2,
  Plus,
  Building,
  AlertCircle,
  X,
} from "lucide-react";

interface WallPost {
  id: string;
  content: string;
  hostelName: string;
  upvotes: number;
  affectedCount: number;
  officialResponse: string | null;
  createdAt: string;
}

export default function WallPage() {
  const { role } = useAuth();
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newHostel, setNewHostel] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  // Response state for management
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/wall");
      const data = await res.json();
      if (data.success) setPosts(data.data as WallPost[]);
    } catch {
      console.error("Failed to fetch wall posts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handlePost() {
    if (!newContent.trim()) return;
    setIsPosting(true);
    setError("");

    try {
      const res = await fetch("/api/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent.trim(),
          hostelName: newHostel.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPosts((prev) => [data.data as WallPost, ...prev]);
        setNewContent("");
        setNewHostel("");
        setShowForm(false);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to post");
    } finally {
      setIsPosting(false);
    }
  }

  async function handleAction(postId: string, action: "upvote" | "affected") {
    try {
      const res = await fetch(`/api/wall/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, ...data.data } : p))
        );
      }
    } catch {
      console.error("Action failed");
    }
  }

  async function handleRespond(postId: string) {
    if (!responseText.trim()) return;
    try {
      const res = await fetch(`/api/wall/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "respond", officialResponse: responseText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, ...data.data } : p))
        );
        setRespondingTo(null);
        setResponseText("");
      }
    } catch {
      console.error("Response failed");
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            The Wall
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Anonymous grievance board · Speak up, stay anonymous
          </p>
        </div>
        {role === "student" && (
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {showForm ? "Cancel" : "Post"}
          </Button>
        )}
      </div>

      {/* New Post Form */}
      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="pt-4 space-y-3">
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <textarea
              placeholder="What's bothering you? Your identity stays hidden."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              maxLength={500}
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Building className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Hostel (optional)"
                  value={newHostel}
                  onChange={(e) => setNewHostel(e.target.value)}
                  className="h-8 text-xs pl-8"
                />
              </div>
              <span className="text-xs text-muted-foreground">{newContent.length}/500</span>
              <Button size="sm" onClick={handlePost} disabled={isPosting || !newContent.trim()}>
                {isPosting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold">The Wall is empty</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Be the first to speak up anonymously.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="transition-all hover:shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm">🎭</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium">Anonymous</p>
                      <p className="text-xs text-muted-foreground">
                        {post.hostelName !== "Anonymous" && `${post.hostelName} · `}
                        {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>

                {/* Official Response */}
                {post.officialResponse && (
                  <div className="mt-3 rounded-lg border bg-blue-50 dark:bg-blue-950/30 p-3">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400 flex items-center gap-1 mb-1">
                      <MessageSquare className="h-3 w-3" />
                      Official Response
                    </p>
                    <p className="text-xs">{post.officialResponse}</p>
                  </div>
                )}

                {/* Management Response Form */}
                {role === "management" && respondingTo === post.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      placeholder="Write official response..."
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={2}
                      className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-xs resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleRespond(post.id)}>
                        <Send className="mr-1 h-3 w-3" /> Send
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setRespondingTo(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>

              <Separator />

              <CardFooter className="py-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => handleAction(post.id, "upvote")}
                >
                  <ThumbsUp className="h-3 w-3" />
                  {post.upvotes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => handleAction(post.id, "affected")}
                >
                  <Users className="h-3 w-3" />
                  Affected Too {post.affectedCount > 0 && `(${post.affectedCount})`}
                </Button>
                {role === "management" && !post.officialResponse && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 ml-auto"
                    onClick={() => {
                      setRespondingTo(post.id);
                      setResponseText("");
                    }}
                  >
                    <MessageSquare className="h-3 w-3" />
                    Respond
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
