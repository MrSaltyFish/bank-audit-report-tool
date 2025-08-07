import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  resetPasswordToken: varchar("resetpasswordtoken", { length: 255 }).default(
    "NULL",
  ),
  resetPasswordTokenExpires: timestamp("resetpasswordtokenexpires"),
});
