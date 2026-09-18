/**
 * FixMyDorm - Mess Menu Page
 *
 * View daily mess menu and rate meals.
 * Uses static/mock data for now — will be managed by management in later phase.
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MEAL_TYPES } from "@/lib/constants";
import { UtensilsCrossed, Star, ThumbsUp, ThumbsDown, Clock } from "lucide-react";

// Mock menu data (will come from DynamoDB in future)
const MOCK_MENU: Record<
  string,
  { items: string[]; time: string }
> = {
  breakfast: {
    items: ["Poha", "Bread & Butter", "Boiled Eggs", "Milk", "Tea / Coffee"],
    time: "7:30 AM – 9:00 AM",
  },
  lunch: {
    items: ["Rice", "Dal Tadka", "Paneer Curry", "Roti", "Salad", "Papad"],
    time: "12:30 PM – 2:00 PM",
  },
  snacks: {
    items: ["Samosa", "Tea / Coffee", "Biscuits"],
    time: "4:30 PM – 5:30 PM",
  },
  dinner: {
    items: ["Jeera Rice", "Rajma", "Mixed Veg", "Roti", "Raita", "Gulab Jamun"],
    time: "7:30 PM – 9:00 PM",
  },
};

const MEAL_EMOJIS: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  snacks: "🍵",
  dinner: "🌙",
};

const MEAL_COLORS: Record<string, string> = {
  breakfast: "bg-amber-500/10 text-amber-700 border-amber-200",
  lunch: "bg-orange-500/10 text-orange-700 border-orange-200",
  snacks: "bg-teal-500/10 text-teal-700 border-teal-200",
  dinner: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
};

export default function MessMenuPage() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const today = new Date();
  const dayName = today.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  function rateMeal(meal: string, rating: number) {
    setRatings((prev) => ({ ...prev, [meal]: rating }));
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6" />
          Mess Menu
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {dayName}, {dateStr}
        </p>
      </div>

      {/* Menu Cards */}
      <div className="space-y-4">
        {(Object.entries(MEAL_TYPES) as [string, string][]).map(
          ([key, label]) => {
            const menu = MOCK_MENU[key];
            const emoji = MEAL_EMOJIS[key];
            const colorClass = MEAL_COLORS[key];
            const currentRating = ratings[key];

            return (
              <Card key={key} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-lg">{emoji}</span>
                      {label}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-xs ${colorClass}`}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {menu.time}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Menu Items */}
                  <div className="flex flex-wrap gap-2">
                    {menu.items.map((item) => (
                      <Badge
                        key={item}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <Separator />

                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Rate this meal:</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => rateMeal(key, star)}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              currentRating && star <= currentRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      ))}
                      {currentRating && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {currentRating}/5
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Feedback */}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 flex-1">
                      <ThumbsUp className="h-3 w-3" /> Good
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 flex-1">
                      <ThumbsDown className="h-3 w-3" /> Bad
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          }
        )}
      </div>
    </div>
  );
}
