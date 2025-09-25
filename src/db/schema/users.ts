import {
    pgTable,
    text,
    timestamp,
    boolean,
    uuid,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

// ------------------ Enums ------------------
export const userStatusEnum = pgEnum("user_status", [
    "active",
    "banned",
    "suspended",
    "deleted",
]);

// ------------------ Users Table ------------------
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),

    username: text("username").notNull().unique(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),

    // Email verification
    emailVerified: timestamp("email_verified_at", { withTimezone: true }),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),

    // Password reset
    resetPasswordToken: text("reset_password_token"), // nullable instead of ""
    resetPasswordTokenExpires: timestamp("reset_password_token_expires", {
        withTimezone: true,
    }),

    // Account verification
    verificationToken: text("verification_token"),
    verificationTokenExpires: timestamp("verification_token_expires", {
        withTimezone: true,
    }),

    // Security & audit
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
    passwordChangedAt: timestamp("password_changed_at", { withTimezone: true }),

    status: userStatusEnum("status").notNull().default("active"),
});

export type User_Select = InferSelectModel<typeof users>;
export type User_Insert = InferInsertModel<typeof users>;
