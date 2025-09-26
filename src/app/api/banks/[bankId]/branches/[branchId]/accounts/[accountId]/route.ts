import { accounts, banks, branches } from "@/db/schema";
import { db } from "@db/connectDB";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type { Account_Insert } from "@db/schema";

// TODO: Refactor them out
import slugify from "slugify";
import { nanoid } from "nanoid";

// TODO: Refactor them out
async function generateUniqueSlug(name: string, currentAccountId?: string) {
  let slug = slugify(name);
  let exists = await db
    .select()
    .from(accounts)
    .where(eq(accounts.slug, slug))
    .then((res) => res.some((row) => row.id !== currentAccountId));

  while (exists) {
    slug = `${slugify(name)}-${nanoid(4)}`;
    exists = await db
      .select()
      .from(accounts)
      .where(eq(accounts.slug, slug))
      .then((res) => res.some((row) => row.id !== currentAccountId));
  }

  return slug;
}

// Get specific account in the branch
export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ bankId: string; branchId: string; accountId: string }>;
  }
) {
  const { bankId, branchId, accountId } = await context.params;

  const row = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .then((res) => res[0]);

  return NextResponse.json({ success: true, account: row }, { status: 200 });
}

// Update specific account in the branch
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{ bankId: string; branchId: string; accountId: string }>;
  }
) {
  const body = await request.json();
  const { bankId, branchId, accountId } = await context.params;

  const {
    nameOfBorrower,
    outstandingBalance,
    sanctionedAmount,
    otherFacilities,
    dateOfSanction,
  } = body;

  const newSlug = nameOfBorrower
    ? await generateUniqueSlug(nameOfBorrower, accountId)
    : undefined;

  const updated = await db
    .update(accounts)
    .set({
      nameOfBorrower: nameOfBorrower ?? undefined,
      sanctionedAmount: sanctionedAmount ?? undefined,
      outstandingBalance: outstandingBalance ?? undefined,
      otherFacilities: otherFacilities ?? "N/A",
      slug: newSlug,
      dateOfSanction: dateOfSanction ? new Date(dateOfSanction) : undefined,
    })
    .where(eq(accounts.id, accountId))
    .returning();

  return NextResponse.json({
    success: true,
    account: updated[0],
  });
}

// Delete specific account in the branch
export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{ bankId: string; branchId: string; accountId: string }>;
  }
) {
  const { bankId, branchId, accountId } = await context.params;
  const deletedRow = await db
    .delete(accounts)
    .where(eq(accounts.id, accountId))
    .returning();

  return NextResponse.json({ success: true, account: deletedRow[0] });
}
