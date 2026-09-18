/**
 * FixMyDorm - AI Chat API
 *
 * POST /api/chat — Send a message to the AI hostel assistant
 * Uses Bedrock Claude for responses, with graceful fallback.
 */

import { NextRequest, NextResponse } from "next/server";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

const SYSTEM_PROMPT = `You are FixMyDorm Assistant, an AI helper for college hostel students in India. You help with:
- Hostel rules and regulations
- How to file complaints and track them
- Lost and found procedures
- Leave request processes (early leave / late entry)
- Mess menu information
- General hostel life advice

Be friendly, concise, and helpful. If you don't know something specific to their hostel, suggest they check with their warden or management.
Keep responses under 200 words.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ success: false, error: "Message required" }, { status: 400 });
    }

    // Build conversation history
    const messages = [];
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }
    messages.push({ role: "user", content: message });

    try {
      const command = new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: new TextEncoder().encode(
          JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 512,
            system: SYSTEM_PROMPT,
            messages,
          })
        ),
      });

      const response = await client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const reply = responseBody.content[0].text;

      return NextResponse.json({ success: true, data: { reply } });
    } catch {
      // Fallback response if Bedrock is unavailable
      const fallbackReplies: Record<string, string> = {
        complaint: "To file a complaint, go to 'My Complaints' from the sidebar and click 'New Complaint'. Fill in the details and our AI will auto-categorize it!",
        lost: "Head to 'Lost & Found' from the sidebar. You can report a lost item or check if someone found yours.",
        leave: "Go to 'Leave Requests' to submit an early leave or late entry request. Your warden will review it.",
        mess: "Check today's menu under 'Mess Menu'. You can also rate meals and give feedback!",
        help: "I'm the FixMyDorm AI assistant! I can help with complaints, lost items, leave requests, and mess info. What do you need?",
      };

      const lowerMsg = message.toLowerCase();
      let reply = fallbackReplies.help;
      for (const [key, val] of Object.entries(fallbackReplies)) {
        if (lowerMsg.includes(key)) {
          reply = val;
          break;
        }
      }

      return NextResponse.json({ success: true, data: { reply, fallback: true } });
    }
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ success: false, error: "Chat failed" }, { status: 500 });
  }
}
