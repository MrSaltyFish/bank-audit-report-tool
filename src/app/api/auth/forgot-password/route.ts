import { NextRequest, NextResponse } from "next/server";
import { resetSchema } from "@libs/validators/auth.validators";
import { db } from "@db/connectDB";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
    const data = req.json();
    const parsed = resetSchema.safeParse(data);

    if (!parsed.success) {
        return NextResponse.json(
            { message: "Did not parse safely, improper email." },
            { status: 401 },
        );
    }

    const resetEmail = parsed.data.email;
    const userExists = await db
        .select()
        .from(users)
        .where(eq(users.email, resetEmail))
        .limit(1)
        .then((res) => res[0]);

    if (!userExists) {
        return NextResponse.json(
            { error: "User does not exist." },
            { status: 404 },
        );
    }

    if (!userExists.verificationTokenExpires) {
        throw new Error("No verification token found");
    }
    if (
        userExists &&
        userExists.verificationTokenExpires < new Date(Date.now() * 5 * 60 * 1000)
    ) {
    }

    const buffer = crypto.randomInt(0, 1_000_000);
    const verificationToken = buffer.toString().padStart(6, "0");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min from now

    const hash = createHash("sha512").update(verificationToken).digest("hex");
    await db
        .update(users)
        .set({
            verificationToken: hash,
            verificationTokenExpires: expiresAt,
        })
        .where(eq(users.email, userExists.email));

    return NextResponse.json(
        { message: "Sent verification token", dev: verificationToken },
        { status: 200 },
    );
}
