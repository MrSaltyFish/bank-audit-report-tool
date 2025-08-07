import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey(),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	resetPasswordToken: text("reset_password_token").notNull().default(""),
	resetPasswordTokenExpires: timestamp("reset_password_token_expires", {
		withTimezone: true,
	}),
});
