import { accounts, banks, branches } from "@/db/schema";
import type { Account_Insert } from "@db/schema";
import { db } from "@db/connectDB";
import { and, eq } from "drizzle-orm";
import { generateUniqueSlug } from "@libs/slugGeneration/slugGeneration";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { decodeAuthToken } from "@libs/authCookieTokenVerify/decodeAuth";

// Get all accounts created in the branch
export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ bankId: string; branchId: string }>;
  }
) {
  const { bankId, branchId } = await context.params;

  const rows = await db
    .select()
    .from(accounts)
    .where(eq(accounts.createdAtBranch, branchId));

  return NextResponse.json({ success: true, accounts: rows }, { status: 200 });
}

// Add an account in the branch
export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ bankId: string; branchId: string }>;
  }
) {
  try {
    // Get auth token from cookie
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let userId: string;

    try {
      userId = decodeAuthToken(authToken);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const {
      accountNo,
      nameOfBorrower,
      sanctionedAmount,
      outstandingBalance,
      accountType,
      currency,
      otherFacilities,
      dateOfSanction,
    } = await request.json();
    const { bankId, branchId } = await context.params;

    // const accountNo = "ACC001"; // TODO: Generate Account Numbers

    const slug = await generateUniqueSlug(nameOfBorrower);

    const newAccount: Account_Insert = {
      userId,
      createdAtBranch: branchId,
      accountNo: accountNo || `ACCT-${Math.floor(Math.random() * 1000000)}`, // example
      accountType: accountType || "Normal",
      currency: currency || "INR",
      nameOfBorrower,
      dateOfSanction: dateOfSanction ? new Date(dateOfSanction) : new Date(),
      sanctionedAmount,
      outstandingBalance,
      otherFacilities: otherFacilities || "N/A",
      slug,
    };
    const inserted = await db.insert(accounts).values(newAccount).returning();

    return NextResponse.json(
      { success: true, account: inserted[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
