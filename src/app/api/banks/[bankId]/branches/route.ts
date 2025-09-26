import { NextRequest, NextResponse } from "next/server";
import { db } from "@db/connectDB";
import { banks, branches } from "@db/schema";
import { eq } from "drizzle-orm";
import slugify from "slugify";

// List all branches
export async function GET(
  request: Request,
  context: { params: Promise<{ bankId: string }> }
) {
  const { bankId } = await context.params;

  if (!bankId) {
    return NextResponse.json(
      { success: false, error: "bankId missing" },
      { status: 400 }
    );
  }

  try {
    const bankBranches = await db
      .select()
      .from(branches)
      .where(eq(branches.bankId, bankId));

    const bank = await db
      .select()
      .from(banks)
      .where(eq(banks.id, bankId))
      .then((res) => res[0]);

    return NextResponse.json(
      { success: true, bankName: bank.bankName, bankBranches },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "DB query failed" },
      { status: 500 }
    );
  }
}

// Add a branch
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ bankId: string }> }
) {
  const { bankId } = await context.params;

  if (!bankId) {
    return NextResponse.json(
      { success: false, error: "bankId missing" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { branchName } = body;

    if (!branchName) {
      return NextResponse.json(
        { success: false, error: "branchName missing" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(branches)
      .values({
        bankId,
        branchName,
        slug: slugify(branchName),
      })
      .returning();

    return NextResponse.json(
      { success: true, branch: result[0] },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "DB insert failed" },
      { status: 500 }
    );
  }
}
