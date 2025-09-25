import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import { NextRequest, NextResponse } from "next/server";

import { createBankSchema } from "@libs/validators/banks.vallidators";

import { db } from "@db/connectDB";
import { branches } from "@/db/schema/branches";
import { banks } from "@db/schema/banks";

export async function GET() {
  try {
    const bankData = await db.select().from(banks);
    console.log(bankData);
    return NextResponse.json(bankData);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch bank data" },
      { status: 500 }
    );
  }
}

//	Create bank (and 1 branch because each bank has at least one branch)
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value; // Takes the name of the cookie

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };

    const userId = decoded.sub;

    const body = await req.json();
    const parsed = createBankSchema.safeParse(body);

    if (!parsed.success) {
      console.error(parsed.error);
      return NextResponse.json(
        { errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { bankName, branchName } = parsed.data!;
    console.log("body:", JSON.stringify(body, null, 2));
    console.log("Fetch status:", body.status);

    const bankExists = await db
      .select()
      .from(banks)
      .where(eq(banks.bankName, bankName));

    console.log(`Bank exists?: ${bankExists}`);

    if (bankExists.length > 0) {
      return NextResponse.json(
        { error: "Bank with this name already exists." },
        { status: 409 } // Conflict
      );
    }

    const bankSlug = slugify(bankName, {
      lower: true,
      strict: true,
    });

    const newBank = await db
      .insert(banks)
      .values({
        userId: userId,
        bankName: bankName,
        slug: bankSlug,
      })
      .returning();

    const branchSlug = slugify(branchName, {
      trim: true,
      lower: true,
    });

    const newBranch = await db
      .insert(branches)
      .values({
        bankId: newBank[0].id,
        branchName: branchName,
        slug: branchSlug,
      })
      .returning();

    return NextResponse.json(newBank[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot create bank" }, { status: 403 });
  }
}
