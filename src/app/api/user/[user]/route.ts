import { NextRequest, NextResponse } from "next/server";
import { db } from "@db/connectDB";
import { accounts } from "@db/schema/accounts";
import { eq } from "drizzle-orm";

type Params = { params: { account: string } };

export async function GET(req: NextRequest, { params }: Params) {
	try {
		const account = await db
			.select()
			.from(accounts)
			.where(eq(accounts.id, params.account));

		if (account.length === 0) {
			return NextResponse.json({ error: "Account not found" }, { status: 404 });
		}

		return NextResponse.json(account[0], { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to fetch account" },
			{ status: 500 },
		);
	}
}

export async function PUT(req: NextRequest, { params }: Params) {
	try {
		const body = await req.json();

		const updated = await db
			.update(accounts)
			.set({ ...body })
			.where(eq(accounts.id, params.account))
			.returning();

		return NextResponse.json(updated[0], { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to update account" },
			{ status: 500 },
		);
	}
}

export async function DELETE(req: NextRequest, { params }: Params) {
	try {
		await db.delete(accounts).where(eq(accounts.id, params.account));
		return NextResponse.json({ message: "Account deleted" }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to delete account" },
			{ status: 500 },
		);
	}
}
