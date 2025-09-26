import { NextRequest, NextResponse } from "next/server";
import { db } from "@db/connectDB";
import { branches } from "@db/schema";
import { eq, and } from "drizzle-orm";
import slugify from "slugify";

// Update a branch (Rename)
export async function PUT(
  request: Request,
  context: { params: Promise<{ bankId: string; branchId: string }> }
) {
  const body = await request.json();
  const { branchName: newBranchName } = body;

  const { bankId, branchId } = await context.params;

  if (!branchId || !newBranchName) {
    return NextResponse.json(
      {
        success: false,
        error: "Branch UUID and/or name not provided.",
      },
      { status: 400 }
    );
  }

  const renameBranch = await db
    .select()
    .from(branches)
    .where(and(eq(branches.id, branchId), eq(branches.bankId, bankId)))
    .limit(1)
    .then((res) => res[0]);

  if (!renameBranch) {
    return NextResponse.json(
      { success: false, error: "No Branch Found." },
      { status: 400 }
    );
  }

  const nameConflict = await db
    .select()
    .from(branches)
    .where(eq(branches.branchName, newBranchName))
    .limit(1)
    .then((res) => res[0]);

  if (nameConflict) {
    return NextResponse.json(
      { success: false, error: "Cannot rename branch." },
      { status: 409 }
    );
  }

  const newBranch = await db
    .update(branches)
    .set({ branchName: newBranchName })
    .where(eq(branches.id, branchId));

  return NextResponse.json(
    { success: true, message: "successfully renamed a branch." },
    { status: 200 }
  );
}

// Delete a branch
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ bankId: string; branchId: string }> }
) {
  const { bankId, branchId } = await context.params;

  const branchExists = await db
    .select()
    .from(branches)
    .where(and(eq(branches.id, branchId), eq(branches.bankId, bankId)));

  if (!branchExists) {
    return NextResponse.json(
      { success: false, error: "No Branch Found, cannot delete." },
      { status: 400 }
    );
  }

  const deleted = await db
    .delete(branches)
    .where(and(eq(branches.id, branchId), eq(branches.bankId, bankId)));

  if (!deleted) {
    return NextResponse.json(
      { success: false, error: "Cannot delete branch." },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Successfully deleted a branch." },
    { status: 200 }
  );
}
