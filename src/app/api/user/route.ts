// app/api/account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@db/connectDB";
import { accounts } from "@db/schema/accounts";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
	try {
		// (optional) filter by user_id from cookie/session
		const allAccounts = await db.select().from(accounts);
		return NextResponse.json(allAccounts, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to fetch accounts" },
			{ status: 500 },
		);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		// validate body with zod schema ideally
		const newAccount = await db
			.insert(accounts)
			.values({
				...body,
			})
			.returning();

		return NextResponse.json(newAccount[0], { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to create account" },
			{ status: 500 },
		);
	}
}
