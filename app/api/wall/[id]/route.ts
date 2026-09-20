/**
 * FixMyDorm - Wall Post Actions API
 *
 * PATCH /api/wall/[id] — Upvote, "Affected Too", or add official response
 */

import { NextRequest, NextResponse } from "next/server";
import { docClient } from "@/lib/aws/dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.DYNAMODB_TABLE_WALL || "fixmydorm-wall";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, officialResponse } = body;

    let updateExpression: string;
    let expressionValues: Record<string, unknown>;
    const expressionNames: Record<string, string> = {};

    switch (action) {
      case "upvote":
        updateExpression = "SET upvotes = upvotes + :inc, updatedAt = :now";
        expressionValues = { ":inc": 1, ":now": new Date().toISOString() };
        break;

      case "undo_upvote":
        updateExpression = "SET upvotes = if_not_exists(upvotes, :zero) - :inc, updatedAt = :now";
        expressionValues = { ":inc": 1, ":zero": 0, ":now": new Date().toISOString() };
        break;

      case "affected":
        updateExpression = "SET affectedCount = affectedCount + :inc, updatedAt = :now";
        expressionValues = { ":inc": 1, ":now": new Date().toISOString() };
        break;

      case "undo_affected":
        updateExpression = "SET affectedCount = if_not_exists(affectedCount, :zero) - :inc, updatedAt = :now";
        expressionValues = { ":inc": 1, ":zero": 0, ":now": new Date().toISOString() };
        break;

      case "respond":
        if (!officialResponse) {
          return NextResponse.json(
            { success: false, error: "Response text required" },
            { status: 400 }
          );
        }
        updateExpression = "SET #resp = :resp, updatedAt = :now";
        expressionValues = {
          ":resp": officialResponse,
          ":now": new Date().toISOString(),
        };
        expressionNames["#resp"] = "officialResponse";
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { pk: "WALL", id },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionValues,
        ...(Object.keys(expressionNames).length > 0 && {
          ExpressionAttributeNames: expressionNames,
        }),
        ReturnValues: "ALL_NEW",
      })
    );

    return NextResponse.json({ success: true, data: result.Attributes });
  } catch (error) {
    console.error("PATCH /api/wall/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    );
  }
}
