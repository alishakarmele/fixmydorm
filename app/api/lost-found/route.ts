/**
 * FixMyDorm - Lost & Found API
 *
 * GET  /api/lost-found — List items
 * POST /api/lost-found — Report lost/found item
 *
 * Falls back to mock data when DynamoDB is unavailable (dev / demo mode).
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { putItem, queryItems } from "@/lib/aws/dynamodb";

const TABLE = process.env.DYNAMODB_TABLE_LOST_FOUND || "fixmydorm-lost-found";

/* ─── Mock data shown when DynamoDB is unreachable ────────────────────────── */
const MOCK_LOST_FOUND_ITEMS = [
  {
    id: "mock-lf-1",
    type: "lost",
    title: "Black JBL Earbuds (Left Bud Missing)",
    description:
      "Lost one earbud from my JBL Tune 230NC — the left one. It's black with a small scratch on the side. Probably fell out during my morning jog around the campus track.",
    location: "Campus Running Track / Sports Complex",
    imageUrl: null,
    contactInfo: "Room 214, Kaveri Hostel",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Kaveri Hostel",
    roomNumber: "214",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    aiMatchScore: null,
    aiMatchedItemId: null,
  },
  {
    id: "mock-lf-2",
    type: "found",
    title: "Blue Wildcraft Backpack",
    description:
      "Found a blue Wildcraft backpack near the library entrance. Has a few notebooks and a calculator inside. Left it with the library front desk for safekeeping.",
    location: "Central Library Entrance",
    imageUrl: null,
    contactInfo: "Library Front Desk",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Godavari Hostel",
    roomNumber: "312",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    aiMatchScore: null,
    aiMatchedItemId: null,
  },
  {
    id: "mock-lf-3",
    type: "lost",
    title: "Silver Titan Watch",
    description:
      "Lost my silver Titan Raga watch somewhere between the mess hall and Narmada Hostel. It has sentimental value — was a gift from my dad. Has an engraving on the back.",
    location: "Mess Hall to Narmada Hostel pathway",
    imageUrl: null,
    contactInfo: "9876543210",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Narmada Hostel",
    roomNumber: "105",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    aiMatchScore: 82,
    aiMatchedItemId: "mock-lf-4",
  },
  {
    id: "mock-lf-4",
    type: "found",
    title: "Silver Wristwatch with Engraving",
    description:
      "Found a silver wristwatch on the pathway near the basketball court. It has an engraving on the back that says 'With love'. Looks like a Titan brand. Kept it with the hostel warden.",
    location: "Basketball Court Pathway",
    imageUrl: null,
    contactInfo: "Narmada Hostel Warden Office",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Ganga Hostel",
    roomNumber: "408",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    aiMatchScore: 82,
    aiMatchedItemId: "mock-lf-3",
  },
  {
    id: "mock-lf-5",
    type: "lost",
    title: "HP Laptop Charger (65W USB-C)",
    description:
      "Left my HP laptop charger in the 3rd floor computer lab. It's a 65W USB-C charger with a blue cable. Desperately need it — laptop is at 5%.",
    location: "Computer Lab, 3rd Floor, Academic Block B",
    imageUrl: null,
    contactInfo: "Room 302, Yamuna Hostel",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Yamuna Hostel",
    roomNumber: "302",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    aiMatchScore: null,
    aiMatchedItemId: null,
  },
  {
    id: "mock-lf-6",
    type: "found",
    title: "Prescription Glasses (Black Frame)",
    description:
      "Found a pair of black-framed prescription glasses in the auditorium after the cultural fest rehearsal. They were under seat C12. Currently with me.",
    location: "Main Auditorium, Seat C12",
    imageUrl: null,
    contactInfo: "Room 118, Kaveri Hostel / 8765432109",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Kaveri Hostel",
    roomNumber: "118",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    aiMatchScore: null,
    aiMatchedItemId: null,
  },
  {
    id: "mock-lf-7",
    type: "lost",
    title: "Red Umbrella with Wooden Handle",
    description:
      "Left my red umbrella in the mess hall during lunch. It has a distinctive wooden handle with a small crack. Please return if found, the monsoon is killing me 🌧️",
    location: "South Mess Hall",
    imageUrl: null,
    contactInfo: "Room 210, Ganga Hostel",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Ganga Hostel",
    roomNumber: "210",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    aiMatchScore: null,
    aiMatchedItemId: null,
  },
  {
    id: "mock-lf-8",
    type: "found",
    title: "Student ID Card — Priya S.",
    description:
      "Found a student ID card near the ATM kiosk. Name on the card is Priya S., 3rd year CSE. Left it at the security desk at the main gate.",
    location: "ATM Kiosk near Main Gate",
    imageUrl: null,
    contactInfo: "Main Gate Security Desk",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Godavari Hostel",
    roomNumber: "415",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    aiMatchScore: null,
    aiMatchedItemId: null,
  },
  {
    id: "mock-lf-9",
    type: "lost",
    title: "Leather Wallet (Brown, Fossil Brand)",
    description:
      "Lost my brown Fossil wallet somewhere in the campus. Had my Aadhaar card, ₹500 cash, and a few visiting cards inside. Last had it at the photocopy shop.",
    location: "Photocopy Shop / Academic Block A corridor",
    imageUrl: null,
    contactInfo: "7654321098",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Kaveri Hostel",
    roomNumber: "320",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    aiMatchScore: null,
    aiMatchedItemId: null,
  },
  {
    id: "mock-lf-10",
    type: "found",
    title: "Bunch of Keys (3 keys + Bike Key)",
    description:
      "Found a bunch of keys near the parking lot — 3 regular keys and 1 Honda Activa key on a red keychain. Turned them in at the hostel office.",
    location: "Two-Wheeler Parking Lot B",
    imageUrl: null,
    contactInfo: "Yamuna Hostel Warden Office",
    status: "open",
    reporterName: "Anonymous",
    hostelName: "Yamuna Hostel",
    roomNumber: "101",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    aiMatchScore: null,
    aiMatchedItemId: null,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const pk = type === "all" ? "LOST" : type.toUpperCase();
    const results = [];

    if (type === "all") {
      for (const t of ["LOST", "FOUND"]) {
        const r = await queryItems(TABLE, undefined, "pk = :pk", { ":pk": t }, { limit, scanForward: false });
        results.push(...r.items);
      }
      results.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
    } else {
      const r = await queryItems(TABLE, undefined, "pk = :pk", { ":pk": pk }, { limit, scanForward: false });
      results.push(...r.items);
    }

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    // DynamoDB unavailable — fall back to mock data for dev/demo
    console.warn("GET /api/lost-found — DynamoDB unavailable, returning mock data:", error);
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const filtered =
      type === "all"
        ? MOCK_LOST_FOUND_ITEMS
        : MOCK_LOST_FOUND_ITEMS.filter((item) => item.type === type);
    return NextResponse.json({ success: true, data: filtered });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description, location, imageUrl, studentId, contactInfo } = body;

    if (!type || !title || !description) {
      return NextResponse.json({ success: false, error: "type, title, description required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const item = {
      pk: type.toUpperCase(),
      id: uuidv4(),
      type,
      title,
      description,
      location: location || "",
      imageUrl: imageUrl || null,
      studentId: studentId || "anonymous",
      contactInfo: contactInfo || "",
      status: "open",
      claimedBy: null,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await putItem(TABLE, item);
    } catch {
      // DynamoDB unavailable — post lives only in-memory for this session
      console.warn("POST /api/lost-found — DynamoDB unavailable, returning item without persistence");
    }

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/lost-found error:", error);
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}
