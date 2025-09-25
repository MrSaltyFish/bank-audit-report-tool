import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { db } from "@db/connectDB";
import { eq } from "drizzle-orm";
import { loginSchema } from "@libs/validators/auth.validators";
import { users } from "@db/schema/users";
import { roles } from "@db/schema/roles";
import { userRoles } from "@db/schema";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not set in environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;

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
				{ error: "User not found. New here? Use Register.", success: false },
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

		const fetchedRoles = await db
			.select({ name: roles.name })
			.from(userRoles)
			.innerJoin(roles, eq(userRoles.roleId, roles.id))
			.where(eq(userRoles.userId, user.id));

		const roleNames = fetchedRoles.map((r) => r.name); // ["admin", "editor"]
		const oneWeek = 60 * 60 * 24 * 7;

		const token = jwt.sign(
			{
				sub: user.id.valueOf(),
				role: roleNames,
				email: user.email.valueOf(),
			},
			JWT_SECRET,
			{ expiresIn: oneWeek },
		);

		const response = NextResponse.json(
			{ message: "Login successful", success: true },
			{ status: 200 },
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
