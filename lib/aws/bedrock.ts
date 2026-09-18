/**
 * FixMyDorm - Amazon Bedrock AI Client
 *
 * Uses Bedrock's foundation models for:
 * - Complaint classification (category + priority)
 * - Duplicate detection
 * - Content moderation
 *
 * Gracefully falls back if Bedrock is not configured.
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

// ============================================================================
// Client Setup
// ============================================================================

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Model ID — using Claude 3 Haiku for fast, cheap classification
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

// ============================================================================
// Types
// ============================================================================

export interface ClassificationResult {
  category: string;
  priority: string;
  confidence: number;
  suggestedTitle?: string;
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  similarComplaintId?: string;
  similarity: number;
  reason?: string;
}

// ============================================================================
// Classification
// ============================================================================

/**
 * Classify a complaint using Bedrock AI.
 * Returns suggested category and priority.
 * Falls back to defaults if Bedrock is unavailable.
 */
export async function classifyComplaint(
  title: string,
  description: string
): Promise<ClassificationResult> {
  try {
    const prompt = `You are a hostel complaint classifier. Analyze this complaint and return a JSON object with:
- "category": one of [plumbing, electrical, furniture, cleanliness, pest_control, internet, security, noise, mess_food, other]
- "priority": one of [critical, high, medium, low]
- "confidence": a number from 0 to 1
- "suggestedTitle": a concise title if the original is vague

Complaint Title: ${title}
Complaint Description: ${description}

Respond ONLY with valid JSON, no explanation.`;

    const response = await invokeModel(prompt);
    const parsed = JSON.parse(response);

    return {
      category: parsed.category || "other",
      priority: parsed.priority || "medium",
      confidence: parsed.confidence || 0.5,
      suggestedTitle: parsed.suggestedTitle,
    };
  } catch (error) {
    console.warn("Bedrock classification failed, using fallback:", error);
    return {
      category: "other",
      priority: "medium",
      confidence: 0,
    };
  }
}

/**
 * Check for duplicate complaints using Bedrock AI.
 * Compares against a list of existing complaint summaries.
 */
export async function detectDuplicates(
  title: string,
  description: string,
  existingComplaints: { id: string; title: string; description: string }[]
): Promise<DuplicateCheckResult> {
  if (existingComplaints.length === 0) {
    return { isDuplicate: false, similarity: 0 };
  }

  try {
    const existingSummaries = existingComplaints
      .slice(0, 10) // Limit to recent 10
      .map((c, i) => `${i + 1}. [ID: ${c.id}] ${c.title}: ${c.description}`)
      .join("\n");

    const prompt = `You are a duplicate complaint detector. Compare this new complaint against existing ones and determine if it's a duplicate.

New Complaint:
Title: ${title}
Description: ${description}

Existing Complaints:
${existingSummaries}

Respond with JSON:
- "isDuplicate": boolean
- "similarComplaintId": the ID of the most similar complaint (or null)
- "similarity": a number from 0 to 1
- "reason": brief explanation

Respond ONLY with valid JSON.`;

    const response = await invokeModel(prompt);
    const parsed = JSON.parse(response);

    return {
      isDuplicate: parsed.isDuplicate || false,
      similarComplaintId: parsed.similarComplaintId,
      similarity: parsed.similarity || 0,
      reason: parsed.reason,
    };
  } catch (error) {
    console.warn("Bedrock duplicate detection failed:", error);
    return { isDuplicate: false, similarity: 0 };
  }
}

// ============================================================================
// Internal Helper
// ============================================================================

/**
 * Invoke a Bedrock model with a text prompt.
 * Uses Claude's Messages API format.
 */
async function invokeModel(prompt: string): Promise<string> {
  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: new TextEncoder().encode(body),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  return responseBody.content[0].text;
}
