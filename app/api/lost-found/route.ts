/**
 * FixMyDorm - Lost & Found API
 *
 * GET  /api/lost-found — List items
 * POST /api/lost-found — Report lost/found item
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { putItem, queryItems } from "@/lib/aws/dynamodb";

const TABLE = process.env.DYNAMODB_TABLE_LOST_FOUND || "fixmydorm-lost-found";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const pk = type === "all" ? "LOST" : type.toUpperCase();
    const results = [];

    if (type === "all") {
      for (const t of ["LOST", "FOUND"]) {
        const r = await queryItems(TABLE, undefined, "pk = :pk", { ":pk": t }, { limit, scanForward: false });
        results.push(...r.items);
      }
      results.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
    } else {
      const r = await queryItems(TABLE, undefined, "pk = :pk", { ":pk": pk }, { limit, scanForward: false });
      results.push(...r.items);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error("GET /api/lost-found error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, location, imageUrl, studentId, contactInfo } = body;

    if (!type || !title || !description) {
      return NextResponse.json({ success: false, error: "type, title, description required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const item = {
      pk: type.toUpperCase(),
      id: uuidv4(),
      type,
      title,
      description,
      location: location || "",
      imageUrl: imageUrl || null,
      studentId: studentId || "anonymous",
      contactInfo: contactInfo || "",
      status: "open",
      claimedBy: null,
      createdAt: now,
      updatedAt: now,
    };

    await putItem(TABLE, item);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/lost-found error:", error);
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}
