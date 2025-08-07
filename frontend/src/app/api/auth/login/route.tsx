import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "@lib/db.js";
import { eq } from "drizzle-orm";
import { LoginInput, loginSchema } from "@lib/validators/auth";
import { users } from "@drizzle/schema";

import { z } from "zod";

export default async function POST(request: NextRequest) {
  const parsed = loginSchema.safeParse(request);

  if (!parsed.success) {
    return { error: z.treeifyError(parsed.error) };
  }

  const { email, password } = parsed.data;
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((res) => res[0]);

  if (!user) {
    return NextResponse;
  }
}
