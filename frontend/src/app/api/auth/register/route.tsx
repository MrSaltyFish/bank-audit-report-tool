import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

import { db } from "@libs/db";
import { eq } from "drizzle-orm";
import { registerSchema } from "@libs/validators/auth";
import { users } from "@libs/schema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 401 });
  }

  const { email, password, username } = parsed.data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((res) => res[0]);

  if (existingUser) {
    return NextResponse.json(
      { error: "Account already exists. Use login instead." },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

  const result = await db
    .insert(users)
    .values({
      email: email,
      username: username,
      passwordHash: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    })
    .returning({ id: users.id, email: users.email, username: users.username });

  const user = result[0];

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in env.");
  }

  const oneWeek = 60 * 60 * 24 * 7;

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: oneWeek,
  });

  const response = NextResponse.json(
    { message: "Register successful" },
    { status: 200 },
  );

  response.cookies.set({
    name: "JWToken",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: oneWeek,
  });

  return response;
}
