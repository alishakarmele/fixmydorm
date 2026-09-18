/**
 * FixMyDorm - Wall Posts API Route
 *
 * GET  /api/wall — List wall posts (newest first)
 * POST /api/wall — Create a new anonymous wall post
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { putItem, queryItems } from "@/lib/aws/dynamodb";

const TABLE = process.env.DYNAMODB_TABLE_WALL || "fixmydorm-wall";

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
    console.error("GET /api/wall error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wall posts" },
      { status: 500 }
    );
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
    };

    await putItem(TABLE, post);

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/wall error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create wall post" },
      { status: 500 }
    );
  }
}
