import { NextRequest, NextResponse } from "next/server";
import { db } from "@db/connectDB";
import { banks } from "@db/schema/banks";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

interface JwtPayload {
	id: string;
}

export async function GET(req: NextRequest) {
	const token = req.cookies.get("auth-token")?.value;
	if (!token)
		return NextResponse.json({ error: "No token provided" }, { status: 401 });

	const JWT_SECRET = process.env.JWT_SECRET;
	if (!JWT_SECRET) throw new Error("No JWT SECRET provided");

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

		console.log("Decoded JWT:", decoded);
		// Fetch all banks for this user
		const userbanks = await db
			.select()
			.from(banks)
			.where(eq(banks.userId, decoded.id));

		console.log("userbanks: ");
		console.log(userbanks);

		const formattedBanks = userbanks.map((b) => ({
			id: b.id,
			userId: b.userId, // Drizzle allows this because references return camelCase?
			bankName: b.bankName,
			slug: b.slug,
		}));

		console.log(formattedBanks);

		return NextResponse.json({
			userId: decoded.id,
			banks: formattedBanks,
		});
	} catch (err) {
		console.error("JWT verification failed:", err);
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get("auth-token")?.value;
		if (!token)
			return NextResponse.json({ error: "No token provided" }, { status: 401 });

		const JWT_SECRET = process.env.JWT_SECRET;
		if (!JWT_SECRET) throw new Error("No JWT SECRET provided");

		const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

		const body = await req.json();
		if (!body.name || !body.type) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const newAccount = await db
			.insert(banks)
			.values({
				...body,
				userId: decoded.id, // associate account with the logged-in user
			})
			.returning();

		return NextResponse.json(newAccount[0], { status: 201 });
	} catch (err) {
		console.error("Failed to create account:", err);
		return NextResponse.json(
			{ error: "Failed to create account" },
			{ status: 500 },
		);
	}
}
