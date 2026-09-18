#!/bin/bash
# FixMyDorm – AWS Resource Setup Script
# Creates all required DynamoDB tables and S3 bucket in eu-north-1
# Run: bash scripts/aws-setup.sh

set -euo pipefail

REGION="eu-north-1"
echo "🚀 Setting up FixMyDorm AWS resources in $REGION..."
echo ""

# ============================================================================
# 1. DynamoDB Table: fixmydorm-complaints
#    PK: id (String)  — no sort key on base table
#    GSI: studentId-index  (PK: studentId, SK: createdAt)
#    GSI: status-index     (PK: status, SK: createdAt)
# ============================================================================
echo "📋 Creating table: fixmydorm-complaints..."
aws dynamodb create-table \
  --region "$REGION" \
  --table-name "fixmydorm-complaints" \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=studentId,AttributeType=S \
    AttributeName=status,AttributeType=S \
    AttributeName=createdAt,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    '[
      {
        "IndexName": "studentId-index",
        "KeySchema": [
          {"AttributeName": "studentId", "KeyType": "HASH"},
          {"AttributeName": "createdAt", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      },
      {
        "IndexName": "status-index",
        "KeySchema": [
          {"AttributeName": "status", "KeyType": "HASH"},
          {"AttributeName": "createdAt", "KeyType": "RANGE"}
        ],
        "Projection": {"ProjectionType": "ALL"}
      }
    ]' \
  --billing-mode PAY_PER_REQUEST \
  --no-cli-pager 2>/dev/null && echo "  ✅ fixmydorm-complaints created" || echo "  ⚠️  fixmydorm-complaints already exists or error"

echo ""

# ============================================================================
# 2. DynamoDB Table: fixmydorm-wall
#    PK: pk (String)  SK: id (String)
#    pk is always "WALL" — single-table pattern
# ============================================================================
echo "📋 Creating table: fixmydorm-wall..."
aws dynamodb create-table \
  --region "$REGION" \
  --table-name "fixmydorm-wall" \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --no-cli-pager 2>/dev/null && echo "  ✅ fixmydorm-wall created" || echo "  ⚠️  fixmydorm-wall already exists or error"

echo ""

# ============================================================================
# 3. DynamoDB Table: fixmydorm-lost-found
#    PK: pk (String)  SK: id (String)
#    pk = "LOST" or "FOUND"
# ============================================================================
echo "📋 Creating table: fixmydorm-lost-found..."
aws dynamodb create-table \
  --region "$REGION" \
  --table-name "fixmydorm-lost-found" \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --no-cli-pager 2>/dev/null && echo "  ✅ fixmydorm-lost-found created" || echo "  ⚠️  fixmydorm-lost-found already exists or error"

echo ""

# ============================================================================
# 4. DynamoDB Table: fixmydorm-leave-requests
#    PK: pk (String)  SK: id (String)
#    pk = studentId or "ALL" (dual-write for management view)
# ============================================================================
echo "📋 Creating table: fixmydorm-leave-requests..."
aws dynamodb create-table \
  --region "$REGION" \
  --table-name "fixmydorm-leave-requests" \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --no-cli-pager 2>/dev/null && echo "  ✅ fixmydorm-leave-requests created" || echo "  ⚠️  fixmydorm-leave-requests already exists or error"

echo ""

# ============================================================================
# 5. S3 Bucket: fixmydorm-uploads
#    Block public access ON, CORS for localhost
# ============================================================================
echo "🪣 Creating S3 bucket: fixmydorm-uploads..."
aws s3api create-bucket \
  --region "$REGION" \
  --bucket "fixmydorm-uploads" \
  --create-bucket-configuration LocationConstraint="$REGION" \
  --no-cli-pager 2>/dev/null && echo "  ✅ fixmydorm-uploads created" || echo "  ⚠️  fixmydorm-uploads already exists or error"

# Block all public access
echo "  🔒 Blocking public access..."
aws s3api put-public-access-block \
  --region "$REGION" \
  --bucket "fixmydorm-uploads" \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --no-cli-pager 2>/dev/null && echo "  ✅ Public access blocked" || echo "  ⚠️  Could not set public access block"

# Set CORS
echo "  🌐 Setting CORS..."
aws s3api put-bucket-cors \
  --region "$REGION" \
  --bucket "fixmydorm-uploads" \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": ["http://localhost:3000", "http://localhost:3001"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3600
      }
    ]
  }' \
  --no-cli-pager 2>/dev/null && echo "  ✅ CORS configured" || echo "  ⚠️  Could not set CORS"

echo ""

# ============================================================================
# 6. Cognito: Create user groups (students & management)
# ============================================================================
POOL_ID="eu-north-1_uup4xy"
echo "👥 Creating Cognito groups in $POOL_ID..."
aws cognito-idp create-group \
  --region "$REGION" \
  --user-pool-id "$POOL_ID" \
  --group-name "students" \
  --description "Student users" \
  --no-cli-pager 2>/dev/null && echo "  ✅ Group 'students' created" || echo "  ⚠️  Group 'students' already exists"

aws cognito-idp create-group \
  --region "$REGION" \
  --user-pool-id "$POOL_ID" \
  --group-name "management" \
  --description "Management/admin users" \
  --no-cli-pager 2>/dev/null && echo "  ✅ Group 'management' created" || echo "  ⚠️  Group 'management' already exists"

echo ""

# ============================================================================
# Done!
# ============================================================================
echo "============================================"
echo "🎉 All AWS resources created!"
echo ""
echo "DynamoDB Tables (PAY_PER_REQUEST billing):"
echo "  • fixmydorm-complaints  (PK: id, GSI: studentId-index, status-index)"
echo "  • fixmydorm-wall        (PK: pk, SK: id)"
echo "  • fixmydorm-lost-found  (PK: pk, SK: id)"
echo "  • fixmydorm-leave-requests (PK: pk, SK: id)"
echo ""
echo "S3 Bucket:"
echo "  • fixmydorm-uploads     (public access blocked, CORS set)"
echo ""
echo "Cognito Groups:"
echo "  • students"
echo "  • management"
echo "============================================"
