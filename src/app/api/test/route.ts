import { db } from "@db/connectDB";
import { roles } from "@db/schema";

import { NextResponse } from "next/server";

export async function GET() {
  const allRoles = await db.select().from(roles);
  console.log("Roles fetched:", allRoles);
  return NextResponse.json({ success: true });
}
