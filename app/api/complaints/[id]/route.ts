/**
 * FixMyDorm - Single Complaint API Route
 *
 * GET   /api/complaints/[id] — Get complaint details
 * PATCH /api/complaints/[id] — Update complaint (status, assignment, response)
 */

import { NextRequest, NextResponse } from "next/server";
import { getItem, updateItem, TABLES } from "@/lib/aws/dynamodb";

// ============================================================================
// GET — Get single complaint
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await getItem(TABLES.COMPLAINTS, { id });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("GET /api/complaints/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch complaint" },
      { status: 500 }
    );
  }
}

// ============================================================================
// PATCH — Update complaint
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Build dynamic update expression
    const updateParts: string[] = [];
    const expressionValues: Record<string, unknown> = {};
    const expressionNames: Record<string, string> = {};

    // Allowed update fields
    const allowedFields: Record<string, string> = {
      status: "#status",
      assignedTo: "#assignedTo",
      managementResponse: "#mgmtResponse",
      priority: "#priority",
      category: "#category",
    };

    for (const [field, alias] of Object.entries(allowedFields)) {
      if (body[field] !== undefined) {
        updateParts.push(`${alias} = :${field}`);
        expressionValues[`:${field}`] = body[field];
        expressionNames[alias] = field;
      }
    }

    if (updateParts.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Always update the updatedAt timestamp
    updateParts.push("#updatedAt = :updatedAt");
    expressionValues[":updatedAt"] = new Date().toISOString();
    expressionNames["#updatedAt"] = "updatedAt";

    const updateExpression = `SET ${updateParts.join(", ")}`;

    // First, verify the complaint exists by checking it has a createdAt
    const existing = await getItem(TABLES.COMPLAINTS, { id });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Complaint not found" },
        { status: 404 }
      );
    }

    const updated = await updateItem(
      TABLES.COMPLAINTS,
      { id, createdAt: existing.createdAt as string },
      updateExpression,
      expressionValues,
      expressionNames
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/complaints/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update complaint" },
      { status: 500 }
    );
  }
}
