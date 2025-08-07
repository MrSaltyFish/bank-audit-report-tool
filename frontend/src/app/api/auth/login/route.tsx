import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "@lib/db.js";
import { eq } from "drizzle-orm";
import { loginSchema } from "@lib/validators/auth";
import { users } from "@drizzle/schema";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
	try {
		const parsed = loginSchema.safeParse(request.json());

		if (!parsed.success) {
			return NextResponse.json(
				{ status: 400 },
				{ error: parsed.error.flatten() },
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

		const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: "7d",
		});

		return NextResponse.json(
			{ message: "Login successful", token },
			{ status: 200 },
		);
	} catch (err: any) {
		console.error(err);

		return NextResponse.json(
			{ error: "Internal Server Error." },
			{ status: 500 },
		);
	}
}
