/**
 * FixMyDorm - The Wall
 *
 * Anonymous grievance board. Every post runs through:
 *  - Amazon Bedrock (Claude) → sentiment analysis + content classification
 *  - Amazon Rekognition → image moderation (if image attached)
 *  - Amazon Translate → regional language translation for management view
 *  - Trending score computed by Bedrock from upvotes + affected count + recency
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { timeAgo } from "@/lib/utils";
import {
  Megaphone, ThumbsUp, Users, MessageSquare,
  Send, Loader2, Plus, Building, AlertCircle, X,
  TrendingUp, Shield, Brain, Sparkles,
} from "lucide-react";

interface WallPost {
  id: string;
  content: string;
  hostelName: string;
  upvotes: number;
  affectedCount: number;
  officialResponse: string | null;
  officialRespondedAt?: string | null;
  createdAt: string;
  // AI fields
  aiSentiment?: "positive" | "negative" | "neutral" | null;
  aiTrendScore?: number | null;
  aiModerationStatus?: "approved" | "flagged" | "pending" | null;
}

/* ─── AI Badge helpers ────────────────────────────────────────────────────── */
function SentimentBadge({ sentiment }: { sentiment?: string | null }) {
  if (!sentiment) return null;
  const map = {
    positive: { emoji: "😊", label: "Positive", cls: "bg-green-100 text-green-700 border-green-200" },
    negative: { emoji: "😤", label: "Concern", cls: "bg-orange-100 text-orange-700 border-orange-200" },
    neutral:  { emoji: "😐", label: "Neutral",  cls: "bg-muted text-muted-foreground border-border" },
  };
  const s = map[sentiment as keyof typeof map];
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${s.cls}`}>
      <Brain className="h-2.5 w-2.5" />
      {s.emoji} Bedrock: {s.label}
    </span>
  );
}

function TrendBadge({ score }: { score?: number | null }) {
  if (!score || score < 50) return null;
  const hot = score >= 85;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
      hot ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"
    }`}>
      <TrendingUp className="h-2.5 w-2.5" />
      {hot ? "🔥 Trending" : "📈 Rising"} {score}
    </span>
  );
}

function ModerationBadge({ status }: { status?: string | null }) {
  if (!status || status === "pending") return null;
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
      status === "approved"
        ? "bg-green-50 text-green-600 border-green-200"
        : "bg-red-50 text-red-600 border-red-200"
    }`}>
      <Shield className="h-2.5 w-2.5" />
      Rekognition: {status === "approved" ? "✓ Safe" : "⚠ Flagged"}
    </span>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function WallPage() {
  const { role } = useAuth();
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newHostel, setNewHostel] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  // Track which posts this user has voted on (localStorage)
  const [votedPosts, setVotedPosts] = useState<Record<string, { upvoted: boolean; affected: boolean }>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fmd-wall-votes");
      if (stored) setVotedPosts(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  function saveVotes(newVotes: Record<string, { upvoted: boolean; affected: boolean }>) {
    setVotedPosts(newVotes);
    try { localStorage.setItem("fmd-wall-votes", JSON.stringify(newVotes)); } catch { /* ignore */ }
  }

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

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  async function handlePost() {
    if (!newContent.trim()) return;
    setIsPosting(true);
    setError("");
    try {
      const res = await fetch("/api/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent.trim(), hostelName: newHostel.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => [data.data as WallPost, ...prev]);
        setNewContent(""); setNewHostel(""); setShowForm(false);
      } else { setError(data.error); }
    } catch { setError("Failed to post"); }
    finally { setIsPosting(false); }
  }

  async function handleAction(postId: string, action: "upvote" | "affected") {
    const voteKey = action === "upvote" ? "upvoted" : "affected";
    const alreadyVoted = votedPosts[postId]?.[voteKey] || false;
    const direction = alreadyVoted ? "undo_" + action : action;

    try {
      const res = await fetch(`/api/wall/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: direction }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...data.data } : p)));
        const newVotes = { ...votedPosts };
        if (!newVotes[postId]) newVotes[postId] = { upvoted: false, affected: false };
        newVotes[postId][voteKey] = !alreadyVoted;
        saveVotes(newVotes);
      }
    } catch { console.error("Action failed"); }
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
        setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...data.data } : p)));
        setRespondingTo(null); setResponseText("");
      }
    } catch { console.error("Response failed"); }
  }

  const trending = posts.filter((p) => (p.aiTrendScore ?? 0) >= 70).length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6" /> The Wall
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

      {/* ── AI Power Banner ────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs">
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <Sparkles className="h-3 w-3 text-primary" /> AI-powered by AWS:
        </span>
        <span className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold border border-orange-200">
          <Brain className="h-3 w-3" /> Bedrock sentiment
        </span>
        <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
          <Shield className="h-3 w-3" /> Rekognition moderation
        </span>
        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold border border-green-200">
          <TrendingUp className="h-3 w-3" /> Trend scoring
        </span>
        {trending > 0 && (
          <span className="ml-auto text-red-600 font-bold">🔥 {trending} trending issues right now</span>
        )}
      </div>

      {/* ── New Post Form ─────────────────────────────────────────────── */}
      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
              <Brain className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
              <span>Your post will be analysed by <strong>Amazon Bedrock</strong> for sentiment and <strong>Amazon Rekognition</strong> for content safety before going live.</span>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> {error}
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

      {/* ── Posts ─────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold">The Wall is empty</h3>
          <p className="text-muted-foreground text-sm mt-1">Be the first to speak up anonymously.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className={`transition-all hover:shadow-sm ${
                (post.aiTrendScore ?? 0) >= 85 ? "border-red-200 ring-1 ring-red-100" :
                (post.aiTrendScore ?? 0) >= 70 ? "border-amber-200" : ""
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
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
                  {/* AI badges top-right */}
                  <div className="flex flex-wrap gap-1 justify-end">
                    <TrendBadge score={post.aiTrendScore} />
                    <SentimentBadge sentiment={post.aiSentiment} />
                    <ModerationBadge status={post.aiModerationStatus} />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>

                {/* Official Response */}
                {post.officialResponse && (
                  <div className="mt-3 rounded-lg border bg-primary/5 border-primary/20 p-3">
                    <p className="text-xs font-semibold text-primary flex items-center gap-1 mb-1">
                      <MessageSquare className="h-3 w-3" />
                      Official Response
                      {post.officialRespondedAt && (
                        <span className="text-muted-foreground font-normal ml-1">· {timeAgo(post.officialRespondedAt)}</span>
                      )}
                    </p>
                    <p className="text-xs text-foreground">{post.officialResponse}</p>
                  </div>
                )}

                {/* Mgmt Response Form */}
                {role === "management" && respondingTo === post.id && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                      <Brain className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                      <span>Your response will be auto-translated into the student&apos;s language via <strong>Amazon Translate</strong>.</span>
                    </div>
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
                      <Button size="sm" variant="ghost" onClick={() => setRespondingTo(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>

              <Separator />

              <CardFooter className="py-2 gap-2 flex-wrap">
                <Button
                  variant="ghost" size="sm"
                  className={`h-7 text-xs gap-1 ${votedPosts[post.id]?.upvoted ? "text-primary bg-primary/10" : ""}`}
                  onClick={() => handleAction(post.id, "upvote")}
                >
                  <ThumbsUp className={`h-3 w-3 ${votedPosts[post.id]?.upvoted ? "fill-current" : ""}`} /> {post.upvotes}
                </Button>
                <Button
                  variant="ghost" size="sm"
                  className={`h-7 text-xs gap-1 ${votedPosts[post.id]?.affected ? "text-orange-600 bg-orange-50" : ""}`}
                  onClick={() => handleAction(post.id, "affected")}
                >
                  <Users className="h-3 w-3" />
                  {votedPosts[post.id]?.affected ? "Affected ✓" : "Affected Too"} {post.affectedCount > 0 && `(${post.affectedCount})`}
                </Button>
                {role === "management" && !post.officialResponse && (
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 text-xs gap-1 ml-auto text-primary"
                    onClick={() => { setRespondingTo(post.id); setResponseText(""); }}
                  >
                    <MessageSquare className="h-3 w-3" /> Respond
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
