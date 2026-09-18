/**
 * FixMyDorm - Lost & Found Page
 *
 * Report lost/found items, browse listings, claim flow.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import {
  PackageSearch,
  Plus,
  X,
  Send,
  Loader2,
  MapPin,
  Phone,
  Search,
  AlertCircle,
} from "lucide-react";

interface LostFoundItem {
  id: string;
  type: "lost" | "found";
  title: string;
  description: string;
  location: string;
  imageUrl: string | null;
  contactInfo: string;
  status: string;
  createdAt: string;
}

export default function LostFoundPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formType, setFormType] = useState<"lost" | "found">("lost");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formContact, setFormContact] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch(`/api/lost-found?type=${filter}`);
      const data = await res.json();
      if (data.success) setItems(data.data as LostFoundItem[]);
    } catch {
      console.error("Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPosting(true);
    setError("");

    try {
      const res = await fetch("/api/lost-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formType,
          title: formTitle,
          description: formDesc,
          location: formLocation,
          contactInfo: formContact,
          studentId: user?.userId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => [data.data as LostFoundItem, ...prev]);
        setShowForm(false);
        setFormTitle("");
        setFormDesc("");
        setFormLocation("");
        setFormContact("");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to post");
    } finally {
      setIsPosting(false);
    }
  }

  const filtered = items.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <PackageSearch className="h-6 w-6" />
            Lost & Found
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Report lost items or help return found ones
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
          {showForm ? "Cancel" : "Report Item"}
        </Button>
      </div>

      {/* New Item Form */}
      {showForm && (
        <Card className="border-primary/20">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-4 space-y-3">
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" /> {error}
                </div>
              )}

              {/* Type Toggle */}
              <div className="grid grid-cols-2 gap-2">
                {(["lost", "found"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormType(t)}
                    className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                      formType === t
                        ? t === "lost"
                          ? "border-red-400 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                          : "border-green-400 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : "border-border"
                    }`}
                  >
                    {t === "lost" ? "🔍 I Lost Something" : "📦 I Found Something"}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Item Name</Label>
                <Input placeholder="e.g., Blue Water Bottle" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <textarea
                  placeholder="Describe the item..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={2}
                  required
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Location</Label>
                  <Input placeholder="Where lost/found" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Contact Info</Label>
                  <Input placeholder="Phone or room no." value={formContact} onChange={(e) => setFormContact(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPosting}>
                {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Post {formType === "lost" ? "Lost" : "Found"} Item
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {(["all", "lost", "found"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "all" ? "All" : f === "lost" ? "🔍 Lost" : "📦 Found"}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-8 text-xs pl-8" />
        </div>
      </div>

      {/* Items */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <PackageSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold">No items found</h3>
          <p className="text-muted-foreground text-sm mt-1">No lost or found items reported yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((item) => (
            <Card key={item.id} className="transition-all hover:shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                  <Badge variant={item.type === "lost" ? "destructive" : "default"} className="text-xs shrink-0">
                    {item.type === "lost" ? "Lost" : "Found"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3 space-y-2">
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </span>
                  )}
                  {item.contactInfo && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {item.contactInfo}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
