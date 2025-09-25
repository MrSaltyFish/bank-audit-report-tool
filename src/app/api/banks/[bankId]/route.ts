import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@db/connectDB";
import { banks } from "@db/schema/banks";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ bankId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value; // Takes the name of the cookie

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    sub: string;
  };

  const userId = decoded.sub;

  const { bankId } = await context.params;

  if (!bankId) {
    console.error(`bankId not found, context: ${context}`);
    return NextResponse.json({ error: "Bank ID is required" }, { status: 400 });
  }

  const exists = await db.select().from(banks).where(eq(banks.id, bankId));
  if (!exists) {
    return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  }
  await db.delete(banks).where(eq(banks.id, bankId));

  return NextResponse.json(
    { message: "Bank deleted successfully" },
    { status: 200 }
  );
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ bankId: string }> }
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value; // Takes the name of the cookie

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
    sub: string;
  };

  const userId = decoded.sub;

  const { bankId } = await context.params;
  if (!bankId) {
    return NextResponse.json(
      { success: false, message: "No Bank ID Provided" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { bankName: newName } = body;

  if (!newName || newName.trim() === "") {
    return NextResponse.json(
      { error: "New bank name is required" },
      { status: 400 }
    );
  }

  const existingBank = await db
    .select()
    .from(banks)
    .where(eq(banks.id, bankId))
    .limit(1)
    .then((res) => res[0]);

  if (!existingBank) {
    return NextResponse.json({ error: "Bank not found" }, { status: 404 });
  }

  const nameConflict = await db
    .select()
    .from(banks)
    .where(eq(banks.bankName, newName))
    .limit(1)
    .then((res) => res[0]);

  if (nameConflict) {
    return NextResponse.json(
      { error: "Bank name already exists" },
      { status: 409 }
    );
  }

  await db.update(banks).set({ bankName: newName }).where(eq(banks.id, bankId));

  return NextResponse.json(
    { message: "Bank renamed successfully" },
    { status: 200 }
  );
}
