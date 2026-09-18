/**
 * FixMyDorm - Leave Requests API
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { putItem, queryItems } from "@/lib/aws/dynamodb";

const TABLE = process.env.DYNAMODB_TABLE_LEAVE || "fixmydorm-leave-requests";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    const pk = studentId || "ALL";
    const result = await queryItems(TABLE, undefined, "pk = :pk", { ":pk": pk }, { limit: 30, scanForward: false });

    return NextResponse.json({ success: true, data: result.items });
  } catch (error) {
    console.error("GET /api/leave-requests error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, studentName, type, reason, date, time, hostelName } = body;

    if (!studentId || !type || !reason || !date) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const item = {
      pk: studentId,
      id: uuidv4(),
      studentId,
      studentName: studentName || "Student",
      type, // "early_leave" or "late_entry"
      reason,
      date,
      time: time || "",
      hostelName: hostelName || "",
      status: "pending",
      approvedBy: null,
      rejectionReason: null,
      createdAt: now,
      updatedAt: now,
    };

    await putItem(TABLE, item);

    // Also store under ALL pk for management queries
    await putItem(TABLE, { ...item, pk: "ALL", id: `${item.id}-all` });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/leave-requests error:", error);
    return NextResponse.json({ success: false, error: "Failed to create" }, { status: 500 });
  }
}
