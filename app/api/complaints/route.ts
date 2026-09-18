/**
 * FixMyDorm - Complaints API Route
 *
 * GET  /api/complaints — List complaints (by studentId or all for management)
 * POST /api/complaints — Create a new complaint with AI classification
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { putItem, queryItems, TABLES } from "@/lib/aws/dynamodb";
import { classifyComplaint, detectDuplicates } from "@/lib/aws/bedrock";
import type { Complaint, ComplaintCategory, Priority } from "@/types";

// ============================================================================
// GET — List complaints
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const lastKey = searchParams.get("lastKey");

    let result;

    if (studentId) {
      // Query by student ID using GSI
      result = await queryItems(
        TABLES.COMPLAINTS,
        "studentId-index",
        "studentId = :sid",
        { ":sid": studentId },
        {
          limit,
          lastKey: lastKey ? JSON.parse(lastKey) : undefined,
          filterExpression: status ? "#status = :status" : undefined,
          expressionNames: status ? { "#status": "status" } : undefined,
          ...(status && {
            // Add status filter to expression values if needed
          }),
        }
      );
    } else if (status) {
      // Query by status using GSI
      result = await queryItems(
        TABLES.COMPLAINTS,
        "status-index",
        "#status = :status",
        { ":status": status },
        {
          limit,
          lastKey: lastKey ? JSON.parse(lastKey) : undefined,
          expressionNames: { "#status": "status" },
        }
      );
    } else {
      // For management: query all by status "submitted" (most urgent)
      result = await queryItems(
        TABLES.COMPLAINTS,
        "status-index",
        "#status = :status",
        { ":status": "submitted" },
        {
          limit,
          expressionNames: { "#status": "status" },
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.items,
      lastEvaluatedKey: result.lastKey
        ? JSON.stringify(result.lastKey)
        : undefined,
    });
  } catch (error) {
    console.error("GET /api/complaints error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST — Create a new complaint
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      title,
      description,
      hostelName,
      roomNumber,
      imageUrls,
      // Optional: manual overrides for category/priority
      category: manualCategory,
      priority: manualPriority,
    } = body;

    // Validate required fields
    if (!studentId || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: studentId, title, description" },
        { status: 400 }
      );
    }

    // AI Classification (falls back gracefully)
    const classification = await classifyComplaint(title, description);

    // Use manual overrides if provided, otherwise use AI results
    const category = (manualCategory || classification.category) as ComplaintCategory;
    const priority = (manualPriority || classification.priority) as Priority;

    // Duplicate detection
    let duplicateOf: string | undefined;
    try {
      // Fetch recent complaints for duplicate check
      const recentResult = await queryItems(
        TABLES.COMPLAINTS,
        "status-index",
        "#status = :status",
        { ":status": "submitted" },
        { limit: 10, expressionNames: { "#status": "status" } }
      );

      const duplicateCheck = await detectDuplicates(
        title,
        description,
        recentResult.items.map((item) => ({
          id: item.id as string,
          title: item.title as string,
          description: item.description as string,
        }))
      );

      if (duplicateCheck.isDuplicate && duplicateCheck.similarity > 0.8) {
        duplicateOf = duplicateCheck.similarComplaintId;
      }
    } catch {
      // Duplicate detection is non-critical — continue without it
    }

    // Build the complaint record
    const now = new Date().toISOString();
    const complaint: Complaint = {
      id: uuidv4(),
      studentId,
      title,
      description,
      category,
      priority,
      status: "submitted",
      hostelName: hostelName || "",
      roomNumber: roomNumber || undefined,
      imageUrls: imageUrls || [],
      duplicateOf,
      upvotes: 0,
      createdAt: now,
      updatedAt: now,
    };

    // Save to DynamoDB
    await putItem(TABLES.COMPLAINTS, complaint as unknown as Record<string, unknown>);

    return NextResponse.json(
      {
        success: true,
        data: complaint,
        classification: {
          aiCategory: classification.category,
          aiPriority: classification.priority,
          confidence: classification.confidence,
          isDuplicate: !!duplicateOf,
          duplicateOf,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/complaints error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create complaint" },
      { status: 500 }
    );
  }
}
