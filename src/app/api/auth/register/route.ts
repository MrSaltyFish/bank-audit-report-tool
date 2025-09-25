import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

import { db } from "@db/connectDB";
import { eq } from "drizzle-orm";
import { registerSchema } from "@libs/validators/auth.validators";
import { users } from "@db/schema/users";
import { userRoles } from "@db/schema/roles";
import { roles } from "@db/schema/roles";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
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
      { status: 409 }
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

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: oneWeek,
  });

  const response = NextResponse.json(
    { message: "Register successful" },
    { status: 201 }
  );

  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: oneWeek,
  });

  return response;
}
