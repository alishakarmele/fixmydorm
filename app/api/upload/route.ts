/**
 * FixMyDorm - Upload API Route
 *
 * POST /api/upload — Generate a presigned S3 URL for image upload
 *
 * Client flow:
 * 1. POST /api/upload with { fileName, contentType, complaintId }
 * 2. Receive { uploadUrl, fileUrl }
 * 3. PUT the file to uploadUrl
 * 4. Store fileUrl in the complaint record
 */

import { NextRequest, NextResponse } from "next/server";
import { getUploadUrl, getComplaintImageKey } from "@/lib/aws/s3";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, contentType, complaintId, fileSize } = body;

    // Validate required fields
    if (!fileName || !contentType || !complaintId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: fileName, contentType, complaintId",
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate file size (if provided)
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024} MB`,
        },
        { status: 400 }
      );
    }

    // Generate S3 key and presigned URL
    const key = getComplaintImageKey(complaintId, fileName);
    const { uploadUrl, fileUrl } = await getUploadUrl(key, contentType);

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl,
        fileUrl,
        key,
      },
    });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
