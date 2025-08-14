import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  PgColumn,
} from "drizzle-orm/pg-core";

import "dotenv/config";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),

  resetPasswordToken: text("reset_password_token").default(""),
  resetPasswordTokenExpires: timestamp("reset_password_token_expires_in", {
    withTimezone: true,
  }).defaultNow(),

  emailVerified: timestamp("email_verified_at", { withTimezone: true }),

  verificationToken: text("verification_token"),
  verificationTokenExpires: timestamp("verification_token_expires", {
    withTimezone: true,
  }).defaultNow(),

  role: text("role").notNull().default("user"),
  isBanned: boolean("is_banned").notNull().default(false),
});

export const banks = pgTable("banks", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(
    (): PgColumn => {
      return banks.id;
    },
    { onDelete: "cascade", onUpdate: "cascade" },
  ),
});
