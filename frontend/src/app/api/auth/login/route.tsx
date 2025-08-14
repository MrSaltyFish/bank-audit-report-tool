import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { db } from "@libs/db";
import { eq } from "drizzle-orm";
import { loginSchema } from "@libs/validators/auth";
import { users } from "@libs/schema";

const JWT_SECRET = process.env.JWT_SECRET ?? "NO STRING";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      console.log(parsed.error);
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((res) => res[0]);

    if (!user) {
      return NextResponse.json(
        { error: "User not found. New here? Use Register." },
        { status: 401 },
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const oneWeek = 60 * 60 * 24 * 7;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: oneWeek,
    });

    const response = NextResponse.json(
      { message: "Login successful", success: true },
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
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }

  return NextResponse.json(
    { error: "Internal Server Error." },
    { status: 500 },
  );
}
