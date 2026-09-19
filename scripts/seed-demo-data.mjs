#!/usr/bin/env node
/**
 * FixMyDorm – Demo Data Seeder
 *
 * Populates all DynamoDB tables with realistic demo data so the app
 * looks alive on first open. Run once after `aws-setup.sh`.
 *
 * Usage: node scripts/seed-demo-data.mjs
 */

import {
  DynamoDBClient,
  PutItemCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({ region: process.env.NEXT_PUBLIC_AWS_REGION || "eu-north-1" });

const now  = new Date();
const ago  = (h) => new Date(now.getTime() - h * 3600_000).toISOString();

/* ─── helpers ─────────────────────────────────────────────────────────────── */
async function put(table, item) {
  await client.send(new PutItemCommand({ TableName: table, Item: marshall(item, { removeUndefinedValues: true }) }));
  console.log(`  ✅ ${table} ← ${item.id ?? item.pk + "#" + item.id}`);
}

/* ══════════════════════════════════════════════════════════════════════════
   1. WALL POSTS  (fixmydorm-wall)
══════════════════════════════════════════════════════════════════════════ */
console.log("\n📢 Seeding The Wall...");

const wallPosts = [
  {
    pk: "WALL", id: randomUUID(),
    content: "The corridor lights on 3rd floor Wing-B have been flickering for 2 weeks. Multiple students have complained verbally but nothing has been done. This is a safety hazard at night!",
    hostelName: "Aryabhatta Hall",
    upvotes: 47, affectedCount: 23,
    aiSentiment: "negative", aiTrendScore: 94,
    aiModerationStatus: "approved",
    officialResponse: "Maintenance team has been notified. Electrician scheduled for Thursday 10 AM. Thank you for raising this — it is now Priority 1.",
    officialRespondedAt: ago(5),
    createdAt: ago(72), updatedAt: ago(5),
  },
  {
    pk: "WALL", id: randomUUID(),
    content: "Mess is serving the SAME menu 4 days in a row. Dal-rice for lunch, dal-rice for dinner. Can the mess committee please show some variety? We're paying full hostel fees.",
    hostelName: "Tagore Bhawan",
    upvotes: 89, affectedCount: 61,
    aiSentiment: "negative", aiTrendScore: 98,
    aiModerationStatus: "approved",
    officialResponse: null,
    createdAt: ago(48), updatedAt: ago(48),
  },
  {
    pk: "WALL", id: randomUUID(),
    content: "Hot water geyser in 2nd floor common bathroom trips the MCB every morning between 6-7 AM, affecting the entire wing. The electrician came twice but the problem keeps returning.",
    hostelName: "Raman Niwas",
    upvotes: 34, affectedCount: 18,
    aiSentiment: "negative", aiTrendScore: 72,
    aiModerationStatus: "approved",
    officialResponse: "New MCB rated for higher load ordered. Installation by Friday. Temporary workaround: use geysers sequentially, not simultaneously.",
    officialRespondedAt: ago(12),
    createdAt: ago(36), updatedAt: ago(12),
  },
  {
    pk: "WALL", id: randomUUID(),
    content: "The reading room AC on 1st floor has been set to 18°C permanently. It's literally a freezer in there. Can someone with warden access set it to at least 24°C?",
    hostelName: "CV Raman Block",
    upvotes: 28, affectedCount: 14,
    aiSentiment: "neutral", aiTrendScore: 55,
    aiModerationStatus: "approved",
    officialResponse: null,
    createdAt: ago(24), updatedAt: ago(24),
  },
  {
    pk: "WALL", id: randomUUID(),
    content: "Washing machines in the basement have been out of service for 10 days. One machine is leaking water. Students are forced to hand-wash or go off-campus. Please expedite repairs.",
    hostelName: "Aryabhatta Hall",
    upvotes: 55, affectedCount: 39,
    aiSentiment: "negative", aiTrendScore: 88,
    aiModerationStatus: "approved",
    officialResponse: "Technician from vendor scheduled Monday. One machine repaired; second needs spare part (ETA 3 days).",
    officialRespondedAt: ago(8),
    createdAt: ago(18), updatedAt: ago(8),
  },
  {
    pk: "WALL", id: randomUUID(),
    content: "Huge shoutout to the night warden Mr. Suresh for actually responding at 2 AM when there was a water leak outside Room 304. Quick action prevented a lot of damage. 👏",
    hostelName: "Gandhi Bhawan",
    upvotes: 72, affectedCount: 5,
    aiSentiment: "positive", aiTrendScore: 60,
    aiModerationStatus: "approved",
    officialResponse: null,
    createdAt: ago(10), updatedAt: ago(10),
  },
  {
    pk: "WALL", id: randomUUID(),
    content: "The water cooler near the gym has had a broken tap for 3 weeks now. Water just drips continuously wasting hundreds of litres. Simple fix but nobody addresses it.",
    hostelName: "Nehru Hall",
    upvotes: 21, affectedCount: 30,
    aiSentiment: "negative", aiTrendScore: 48,
    aiModerationStatus: "approved",
    officialResponse: null,
    createdAt: ago(6), updatedAt: ago(6),
  },
];

for (const post of wallPosts) await put("fixmydorm-wall", post);

/* ══════════════════════════════════════════════════════════════════════════
   2. LOST & FOUND  (fixmydorm-lost-found)
══════════════════════════════════════════════════════════════════════════ */
console.log("\n📦 Seeding Lost & Found...");

const lostFoundItems = [
  // LOST
  {
    pk: "LOST", id: randomUUID(),
    type: "lost",
    title: "Blue JBL Bluetooth Speaker",
    description: "JBL Flip 5 in blue colour. Last seen in the common room on Saturday evening after the study group. Has a small sticker of a guitar on the side.",
    reporterName: "Ankit Mehta",
    hostelName: "Aryabhatta Hall",
    roomNumber: "B-215",
    imageUrl: null,
    aiMatchScore: null,
    aiMatchedItemId: null,
    status: "active",
    createdAt: ago(48), updatedAt: ago(48),
  },
  {
    pk: "LOST", id: randomUUID(),
    type: "lost",
    title: "Black Laptop Charger (Dell 65W)",
    description: "Dell 65W barrel charger with a yellow tip. Left it in the library computer lab on Tuesday afternoon. Has my initials 'RK' written in white marker near the brick.",
    reporterName: "Riya Kapoor",
    hostelName: "Sarojini Bhawan",
    roomNumber: "A-108",
    imageUrl: null,
    aiMatchScore: null,
    aiMatchedItemId: null,
    status: "active",
    createdAt: ago(30), updatedAt: ago(30),
  },
  {
    pk: "LOST", id: randomUUID(),
    type: "lost",
    title: "College ID Card – Priya Sharma",
    description: "College ID with student number 2021CS089. Lost somewhere between the hostel gate and the CSE department on Wednesday morning.",
    reporterName: "Priya Sharma",
    hostelName: "Raman Niwas",
    roomNumber: "C-312",
    imageUrl: null,
    aiMatchScore: 87,
    aiMatchedItemId: "FOUND_MATCH_1",
    status: "matched",
    createdAt: ago(20), updatedAt: ago(4),
  },
  {
    pk: "LOST", id: randomUUID(),
    type: "lost",
    title: "Grey Hoodie (XL) – H&M",
    description: "Grey H&M hoodie size XL with a small coffee stain on the left sleeve. Left in the gym changing room last Thursday.",
    reporterName: "Kabir Singh",
    hostelName: "Aryabhatta Hall",
    roomNumber: "D-401",
    imageUrl: null,
    aiMatchScore: null,
    aiMatchedItemId: null,
    status: "active",
    createdAt: ago(96), updatedAt: ago(96),
  },
  // FOUND
  {
    pk: "FOUND", id: "FOUND_MATCH_1",
    type: "found",
    title: "College ID Card Found Near Library",
    description: "Found a college ID card on the path between CSE block and library gate. Name on card: Priya Sharma. Deposited with hostel security desk.",
    reporterName: "Arjun Nair",
    hostelName: "Tagore Bhawan",
    roomNumber: "B-203",
    imageUrl: null,
    aiMatchScore: 87,
    aiMatchedItemId: null,
    status: "matched",
    createdAt: ago(8), updatedAt: ago(4),
  },
  {
    pk: "FOUND", id: randomUUID(),
    type: "found",
    title: "Black Umbrella (Compact) Found in Canteen",
    description: "Compact black umbrella with a curved wooden handle found on the chair in the main canteen. Handed over to canteen staff. Please claim ASAP.",
    reporterName: "Sneha Rao",
    hostelName: "Gandhi Bhawan",
    roomNumber: "A-501",
    imageUrl: null,
    aiMatchScore: null,
    aiMatchedItemId: null,
    status: "active",
    createdAt: ago(12), updatedAt: ago(12),
  },
  {
    pk: "FOUND", id: randomUUID(),
    type: "found",
    title: "Spectacles (Black Frame) Found Near Sports Ground",
    description: "Found a pair of glasses with black rectangular frames near the cricket net. Lenses appear prescription strength. Kept with sports room caretaker Ramesh.",
    reporterName: "Dev Bhatnagar",
    hostelName: "Nehru Hall",
    roomNumber: "C-114",
    imageUrl: null,
    aiMatchScore: null,
    aiMatchedItemId: null,
    status: "active",
    createdAt: ago(3), updatedAt: ago(3),
  },
];

for (const item of lostFoundItems) await put("fixmydorm-lost-found", item);

/* ══════════════════════════════════════════════════════════════════════════
   3. LEAVE REQUESTS  (fixmydorm-leave-requests)
══════════════════════════════════════════════════════════════════════════ */
console.log("\n🚪 Seeding Leave Requests...");

const leaveRequests = [
  {
    pk: "ALL", id: randomUUID(),
    studentId: "demo-student-001",
    studentName: "Aarav Sharma",
    hostelName: "Aryabhatta Hall", roomNumber: "B-312",
    type: "early_leave",
    reason: "Attending NIT Trichy cultural fest 'Festember' as part of the dance team. Official invitation attached.",
    fromDate: new Date(now.getTime() + 48 * 3600_000).toISOString().split("T")[0],
    toDate:   new Date(now.getTime() + 72 * 3600_000).toISOString().split("T")[0],
    status: "approved",
    aiRiskScore: 12,
    reviewedBy: "Warden Singh",
    reviewNote: "Approved. Student to return by 11 PM Sunday.",
    createdAt: ago(36), updatedAt: ago(10),
  },
  {
    pk: "ALL", id: randomUUID(),
    studentId: "demo-student-002",
    studentName: "Riya Kapoor",
    hostelName: "Sarojini Bhawan", roomNumber: "A-108",
    type: "late_entry",
    reason: "Inter-college debate competition at DU South Campus. Event runs till 9:30 PM. Need entry till 11 PM.",
    fromDate: new Date(now.getTime() + 24 * 3600_000).toISOString().split("T")[0],
    toDate:   new Date(now.getTime() + 24 * 3600_000).toISOString().split("T")[0],
    status: "pending",
    aiRiskScore: 8,
    reviewedBy: null,
    reviewNote: null,
    createdAt: ago(6), updatedAt: ago(6),
  },
  {
    pk: "ALL", id: randomUUID(),
    studentId: "demo-student-003",
    studentName: "Kabir Singh",
    hostelName: "Aryabhatta Hall", roomNumber: "D-401",
    type: "early_leave",
    reason: "Medical emergency — grandmother hospitalised in Chandigarh. Need to travel urgently.",
    fromDate: ago(24).split("T")[0],
    toDate:   new Date(now.getTime() + 48 * 3600_000).toISOString().split("T")[0],
    status: "approved",
    aiRiskScore: 5,
    reviewedBy: "Warden Mehra",
    reviewNote: "Emergency approved. Student to update on return.",
    createdAt: ago(30), updatedAt: ago(28),
  },
  {
    pk: "ALL", id: randomUUID(),
    studentId: "demo-student-004",
    studentName: "Priya Sharma",
    hostelName: "Raman Niwas", roomNumber: "C-312",
    type: "early_leave",
    reason: "Home visit for Diwali holidays. Family function with extended relatives.",
    fromDate: new Date(now.getTime() + 72 * 3600_000).toISOString().split("T")[0],
    toDate:   new Date(now.getTime() + 168 * 3600_000).toISOString().split("T")[0],
    status: "pending",
    aiRiskScore: 20,
    reviewedBy: null,
    reviewNote: null,
    createdAt: ago(2), updatedAt: ago(2),
  },
];

for (const req of leaveRequests) await put("fixmydorm-leave-requests", req);

/* ══════════════════════════════════════════════════════════════════════════
   4. COMPLAINTS  (fixmydorm-complaints)
══════════════════════════════════════════════════════════════════════════ */
console.log("\n🎫 Seeding Complaints...");

const complaints = [
  {
    id: randomUUID(),
    studentId: "demo-student-001",
    studentName: "Aarav Sharma",
    hostelName: "Aryabhatta Hall", roomNumber: "B-312",
    title: "Ceiling fan sparking and stopped working",
    description: "Sudden sparking sound observed near the ceiling regulator coupling during high RPM. Immediately switched off the socket to avoid fuse breakdown. Strong burning smell persists.",
    category: "electrical",
    priority: "critical",
    status: "in_progress",
    aiCategory: "electrical",
    aiPriority: "critical",
    aiConfidence: 0.97,
    aiDuplicateOf: null,
    assignedTo: "Ramesh K. (Electrician)",
    assignedAt: ago(1),
    resolution: null,
    imageUrls: [],
    createdAt: ago(3), updatedAt: ago(1),
  },
  {
    id: randomUUID(),
    studentId: "demo-student-001",
    studentName: "Aarav Sharma",
    hostelName: "Aryabhatta Hall", roomNumber: "B-312",
    title: "Hot water geyser tripping main circuit",
    description: "Whenever the geyser is powered on in Room B-312 bathroom, the MCB tripping switch triggers for the whole corridor wing. Affecting 12+ rooms.",
    category: "plumbing",
    priority: "high",
    status: "in_progress",
    aiCategory: "electrical",
    aiPriority: "high",
    aiConfidence: 0.89,
    aiDuplicateOf: null,
    assignedTo: "Plumbing Wing Team",
    assignedAt: ago(8),
    resolution: null,
    imageUrls: [],
    createdAt: ago(12), updatedAt: ago(8),
  },
  {
    id: randomUUID(),
    studentId: "demo-student-002",
    studentName: "Riya Kapoor",
    hostelName: "Sarojini Bhawan", roomNumber: "A-108",
    title: "Study table drawer lock stuck",
    description: "Brass key broke halfway inside the tumbler cylinder. Left drawer locked with academic notebooks and lab record inside. Exam submission is tomorrow.",
    category: "furniture",
    priority: "medium",
    status: "under_review",
    aiCategory: "furniture",
    aiPriority: "medium",
    aiConfidence: 0.94,
    aiDuplicateOf: null,
    assignedTo: null,
    assignedAt: null,
    resolution: null,
    imageUrls: [],
    createdAt: ago(24), updatedAt: ago(18),
  },
  {
    id: randomUUID(),
    studentId: "demo-student-003",
    studentName: "Kabir Singh",
    hostelName: "Aryabhatta Hall", roomNumber: "D-401",
    title: "Balcony drainage slow after monsoon rain",
    description: "Leaves and silt blocking external run-off spouts on 4th floor balcony. Water pooling on balcony floor creating mosquito breeding risk.",
    category: "cleanliness",
    priority: "low",
    status: "resolved",
    aiCategory: "cleanliness",
    aiPriority: "low",
    aiConfidence: 0.91,
    aiDuplicateOf: null,
    assignedTo: "Housekeeping Team",
    assignedAt: ago(72),
    resolution: "Drain cleared and verified by housekeeping. Balcony now drains within 2 minutes of heavy rain.",
    imageUrls: [],
    createdAt: ago(96), updatedAt: ago(48),
  },
  {
    id: randomUUID(),
    studentId: "demo-student-004",
    studentName: "Priya Sharma",
    hostelName: "Raman Niwas", roomNumber: "C-312",
    title: "Wi-Fi router in Wing C completely down",
    description: "The Wi-Fi AP in Wing C corridor has been offline since yesterday midnight. Students are unable to attend online classes and submit assignments. Urgent fix needed.",
    category: "internet",
    priority: "high",
    status: "resolved",
    aiCategory: "internet",
    aiPriority: "high",
    aiConfidence: 0.96,
    aiDuplicateOf: null,
    assignedTo: "IT Team",
    assignedAt: ago(20),
    resolution: "Router firmware updated and reset. All 24 devices reconnected. Added backup router to Wing C inventory.",
    imageUrls: [],
    createdAt: ago(30), updatedAt: ago(10),
  },
  {
    id: randomUUID(),
    studentId: "demo-student-002",
    studentName: "Riya Kapoor",
    hostelName: "Sarojini Bhawan", roomNumber: "A-108",
    title: "Cockroach infestation in pantry area",
    description: "Large number of cockroaches seen in the shared pantry on 1st floor, especially near the sink and behind the microwave. Health hazard for all residents.",
    category: "cleanliness",
    priority: "high",
    status: "submitted",
    aiCategory: "cleanliness",
    aiPriority: "high",
    aiConfidence: 0.93,
    aiDuplicateOf: null,
    assignedTo: null,
    assignedAt: null,
    resolution: null,
    imageUrls: [],
    createdAt: ago(2), updatedAt: ago(2),
  },
];

for (const c of complaints) await put("fixmydorm-complaints", c);

console.log("\n🎉 All demo data seeded successfully!");
console.log("   Wall posts:     ", wallPosts.length);
console.log("   Lost & Found:   ", lostFoundItems.length);
console.log("   Leave Requests: ", leaveRequests.length);
console.log("   Complaints:     ", complaints.length);
