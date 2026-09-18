/**
 * FixMyDorm - DynamoDB Client & Helpers
 *
 * Provides a configured DynamoDB Document Client and helper functions
 * for CRUD operations on the complaints table.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  type PutCommandInput,
  type GetCommandInput,
  type QueryCommandInput,
  type UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

// ============================================================================
// Client Setup
// ============================================================================

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

// ============================================================================
// Table Names
// ============================================================================

export const TABLES = {
  COMPLAINTS: process.env.DYNAMODB_TABLE_COMPLAINTS || "fixmydorm-complaints",
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/** Put a single item into a table */
export async function putItem(tableName: string, item: Record<string, unknown>) {
  const params: PutCommandInput = {
    TableName: tableName,
    Item: item,
  };
  return docClient.send(new PutCommand(params));
}

/** Get a single item by primary key */
export async function getItem(
  tableName: string,
  key: Record<string, string>
) {
  const params: GetCommandInput = {
    TableName: tableName,
    Key: key,
  };
  const result = await docClient.send(new GetCommand(params));
  return result.Item || null;
}

/** Query items using a key condition expression */
export async function queryItems(
  tableName: string,
  indexName: string | undefined,
  keyCondition: string,
  expressionValues: Record<string, unknown>,
  options?: {
    scanForward?: boolean;
    limit?: number;
    lastKey?: Record<string, unknown>;
    filterExpression?: string;
    expressionNames?: Record<string, string>;
  }
) {
  const params: QueryCommandInput = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: keyCondition,
    ExpressionAttributeValues: expressionValues,
    ScanIndexForward: options?.scanForward ?? false, // newest first by default
    Limit: options?.limit,
    ExclusiveStartKey: options?.lastKey as Record<string, unknown> | undefined,
    FilterExpression: options?.filterExpression,
    ExpressionAttributeNames: options?.expressionNames,
  };
  const result = await docClient.send(new QueryCommand(params));
  return {
    items: result.Items || [],
    lastKey: result.LastEvaluatedKey,
  };
}

/** Update an item with an update expression */
export async function updateItem(
  tableName: string,
  key: Record<string, string>,
  updateExpression: string,
  expressionValues: Record<string, unknown>,
  expressionNames?: Record<string, string>
) {
  const params: UpdateCommandInput = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionValues,
    ExpressionAttributeNames: expressionNames,
    ReturnValues: "ALL_NEW",
  };
  const result = await docClient.send(new UpdateCommand(params));
  return result.Attributes;
}
