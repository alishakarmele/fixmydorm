/**
 * FixMyDorm - Complaints API Route
 *
 * GET  /api/complaints — List complaints (by studentId or all for management)
 * POST /api/complaints — Create a new complaint with AI classification
 *
 * Falls back to mock data when DynamoDB is unavailable (dev / demo mode).
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { putItem, queryItems, TABLES } from "@/lib/aws/dynamodb";
import { classifyComplaint, detectDuplicates } from "@/lib/aws/bedrock";
import type { Complaint, ComplaintCategory, Priority } from "@/types";

/* ─── Mock data shown when DynamoDB is unreachable ────────────────────────── */
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "mock-complaint-1",
    studentId: "demo-student",
    studentName: "Anonymous",
    title: "Ceiling fan making loud grinding noise",
    description:
      "The ceiling fan in room 214 has been making a loud grinding noise for the past 3 days. It vibrates so much that it feels unsafe. Please send an electrician ASAP.",
    category: "electrical",
    priority: "high",
    status: "submitted",
    hostelName: "Kaveri Hostel",
    roomNumber: "214",
    imageUrls: [],
    upvotes: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "mock-complaint-2",
    studentId: "demo-student",
    studentName: "Anonymous",
    title: "Bathroom drain completely blocked",
    description:
      "The bathroom drain in the shared bathroom on 3rd floor is completely blocked. Water is overflowing and the floor is always wet. Slipped and almost fell yesterday.",
    category: "plumbing",
    priority: "critical",
    status: "in_progress",
    hostelName: "Kaveri Hostel",
    roomNumber: "3rd Floor Common",
    imageUrls: [],
    assignedTo: "Maintenance Team B",
    upvotes: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "mock-complaint-3",
    studentId: "demo-student",
    studentName: "Anonymous",
    title: "Wi-Fi router not working in Block C",
    description:
      "The Wi-Fi router on the 2nd floor of Block C has been offline since yesterday. Multiple students are affected and we have assignment submissions due tonight.",
    category: "internet",
    priority: "high",
    status: "under_review",
    hostelName: "Godavari Hostel",
    roomNumber: "Block C",
    imageUrls: [],
    upvotes: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "mock-complaint-4",
    studentId: "demo-student",
    studentName: "Anonymous",
    title: "Mess food quality deteriorating",
    description:
      "The quality of mess food has been going downhill for the past month. The dal is watery, chapatis are stale, and the rice is undercooked most days. We pay good money for this.",
    category: "mess_food",
    priority: "medium",
    status: "resolved",
    hostelName: "Kaveri Hostel",
    roomNumber: "214",
    imageUrls: [],
    managementResponse: "We have spoken to the mess contractor and will be monitoring quality daily. A feedback form has been placed at the mess counter.",
    upvotes: 22,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

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
    // DynamoDB unavailable — fall back to mock data for dev/demo
    console.warn("GET /api/complaints — DynamoDB unavailable, returning mock data:", error);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const filtered = status
      ? MOCK_COMPLAINTS.filter((c) => c.status === status)
      : MOCK_COMPLAINTS;
    return NextResponse.json({ success: true, data: filtered });
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

    // Save to DynamoDB (graceful fallback)
    try {
      await putItem(TABLES.COMPLAINTS, complaint as unknown as Record<string, unknown>);
    } catch {
      // DynamoDB unavailable — complaint lives only in-memory for this session
      console.warn("POST /api/complaints — DynamoDB unavailable, returning complaint without persistence");
    }

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

