/**
 * FixMyDorm - S3 Client & Presigned URL Generation
 *
 * Handles image upload via presigned URLs.
 * Flow: Client requests presigned URL → uploads directly to S3 → stores URL in complaint.
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ============================================================================
// Client Setup
// ============================================================================

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET || "fixmydorm-uploads";

// ============================================================================
// Presigned URL Functions
// ============================================================================

/**
 * Generate a presigned URL for uploading a file to S3.
 * The client can PUT directly to this URL.
 *
 * @param key - The S3 object key (e.g., "complaints/abc123/image1.jpg")
 * @param contentType - MIME type of the file
 * @param expiresIn - URL expiration in seconds (default: 5 minutes)
 */
export async function getUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 300
): Promise<{ uploadUrl: string; fileUrl: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });

  // The permanent URL for accessing the file (via presigned GET or CloudFront)
  const fileUrl = `https://${BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1"}.amazonaws.com/${key}`;

  return { uploadUrl, fileUrl };
}

/**
 * Generate a presigned URL for reading/viewing a file from S3.
 *
 * @param key - The S3 object key
 * @param expiresIn - URL expiration in seconds (default: 1 hour)
 */
export async function getViewUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate the S3 key for a complaint image.
 *
 * @param complaintId - The complaint ID
 * @param fileName - Original file name
 */
export function getComplaintImageKey(
  complaintId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `complaints/${complaintId}/${timestamp}-${sanitized}`;
}
