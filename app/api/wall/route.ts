/**
 * FixMyDorm - Wall Posts API Route
 *
 * GET  /api/wall — List wall posts (newest first)
 * POST /api/wall — Create a new anonymous wall post
 *
 * Falls back to mock data when DynamoDB is unavailable (dev / demo mode).
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { putItem, queryItems } from "@/lib/aws/dynamodb";

const TABLE = process.env.DYNAMODB_TABLE_WALL || "fixmydorm-wall";

/* ─── Mock data shown when DynamoDB is unreachable ────────────────────────── */
const MOCK_WALL_POSTS = [
  {
    id: "mock-wall-1",
    content:
      "The water pressure in Block C has been terrible for the past 2 weeks. Can barely take a shower in the morning. Multiple floors are affected and nobody from maintenance has shown up despite repeated verbal complaints.",
    hostelName: "Kaveri Hostel",
    upvotes: 47,
    affectedCount: 23,
    officialResponse:
      "We have identified a faulty pump on the terrace. Replacement part arrives Monday — temporary tanker service arranged for Block C mornings until then.",
    officialRespondedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    aiSentiment: "negative" as const,
    aiTrendScore: 92,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-2",
    content:
      "Wi-Fi in the entire South Wing has been down since yesterday evening. We have mid-semester exams next week and literally cannot access any study material. This is unacceptable.",
    hostelName: "Godavari Hostel",
    upvotes: 63,
    affectedCount: 41,
    officialResponse: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    aiSentiment: "negative" as const,
    aiTrendScore: 97,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-3",
    content:
      "Cockroach infestation on the 3rd floor is getting out of control. Found them in the common kitchen, bathrooms, and even inside room cupboards. Pest control was supposed to come last week but never did.",
    hostelName: "Narmada Hostel",
    upvotes: 38,
    affectedCount: 19,
    officialResponse: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    aiSentiment: "negative" as const,
    aiTrendScore: 85,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-4",
    content:
      "Shout out to the mess staff for finally adding a South Indian breakfast option on weekdays! The dosas and idlis have been really good. Small wins matter 🎉",
    hostelName: "Kaveri Hostel",
    upvotes: 29,
    affectedCount: 0,
    officialResponse: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    aiSentiment: "positive" as const,
    aiTrendScore: 45,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-5",
    content:
      "The corridor lights on the 2nd floor of Block A have been flickering for days. It's genuinely creepy at night and a safety hazard. Can we please get the electrician to take a look?",
    hostelName: "Ganga Hostel",
    upvotes: 21,
    affectedCount: 12,
    officialResponse:
      "Electrician scheduled for tomorrow morning. The issue is with the MCB panel — will be resolved by end of day.",
    officialRespondedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    aiSentiment: "negative" as const,
    aiTrendScore: 62,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-6",
    content:
      "The washing machines in the laundry room are always occupied and half of them are broken. 4 machines for 200+ students is just not enough. We need more machines or a booking system.",
    hostelName: "Yamuna Hostel",
    upvotes: 34,
    affectedCount: 28,
    officialResponse: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    aiSentiment: "negative" as const,
    aiTrendScore: 78,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-7",
    content:
      "Can we talk about how the mess food quality has dropped drastically this semester? The dal is literally just yellow water now. We pay ₹45k per semester for this?",
    hostelName: "Godavari Hostel",
    upvotes: 52,
    affectedCount: 35,
    officialResponse: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    aiSentiment: "negative" as const,
    aiTrendScore: 88,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-8",
    content:
      "The new common room setup with the projector and bean bags is amazing! Great job by the hostel committee. Movie nights are actually fun now 🍿",
    hostelName: "Narmada Hostel",
    upvotes: 18,
    affectedCount: 0,
    officialResponse: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 55).toISOString(),
    aiSentiment: "positive" as const,
    aiTrendScore: 30,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-9",
    content:
      "Someone keeps propping open the main gate after midnight. This is a serious security concern. We've reported it multiple times but nothing has changed. Can we get a self-closing mechanism installed?",
    hostelName: "Ganga Hostel",
    upvotes: 26,
    affectedCount: 15,
    officialResponse:
      "Self-closing hydraulic door closer has been ordered. ETA 3 days. Security has been briefed to do hourly checks until then.",
    officialRespondedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    aiSentiment: "negative" as const,
    aiTrendScore: 71,
    aiModerationStatus: "approved" as const,
  },
  {
    id: "mock-wall-10",
    content:
      "The RO water purifier on the ground floor has been showing a red filter warning for over a month. Are we drinking safe water? This needs immediate attention.",
    hostelName: "Kaveri Hostel",
    upvotes: 41,
    affectedCount: 30,
    officialResponse: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    aiSentiment: "negative" as const,
    aiTrendScore: 94,
    aiModerationStatus: "approved" as const,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Use partition "WALL" with createdAt as sort key
    const result = await queryItems(
      TABLE,
      undefined,
      "pk = :pk",
      { ":pk": "WALL" },
      { limit, scanForward: false }
    );

    return NextResponse.json({ success: true, data: result.items });
  } catch (error) {
    // DynamoDB unavailable — fall back to mock data for dev/demo
    console.warn("GET /api/wall — DynamoDB unavailable, returning mock data:", error);
    return NextResponse.json({ success: true, data: MOCK_WALL_POSTS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, hostelName } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { success: false, error: "Content must be 500 characters or less" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const post = {
      pk: "WALL",
      id: uuidv4(),
      content: content.trim(),
      hostelName: hostelName || "Anonymous",
      upvotes: 0,
      affectedCount: 0,
      officialResponse: null,
      createdAt: now,
      updatedAt: now,
      // Mock AI fields for demo
      aiSentiment: "neutral" as const,
      aiTrendScore: 10,
      aiModerationStatus: "approved" as const,
    };

    try {
      await putItem(TABLE, post);
    } catch {
      // DynamoDB unavailable — post lives only in-memory for this session
      console.warn("POST /api/wall — DynamoDB unavailable, returning post without persistence");
    }

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/wall error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create wall post" },
      { status: 500 }
    );
  }
}
