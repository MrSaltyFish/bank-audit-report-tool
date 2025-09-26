import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  pgTable,
  text,
  date,
  numeric,
  uuid,
  PgColumn,
} from "drizzle-orm/pg-core";

import "dotenv/config";

import { branches } from "@db/schema/branches";
import { users } from "@db/schema/users";

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userid: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAtBranch: uuid("created_at_branch_id")
    .references(
      (): PgColumn => {
        return branches.id;
      },
      { onDelete: "cascade", onUpdate: "cascade" }
    )
    .notNull(),

  accountNo: text("account_number").notNull(),
  accountType: text("account_type"),
  currency: text("currency").notNull().default("INR"),

  nameOfBorrower: text("name_of_borrower").notNull(),
  dateOfSanction: date("date_of_sanction", { mode: "date" }),
  sanctionedAmount: numeric("sanctioned_amount").notNull(),
  outstandingBalance: numeric("outstanding_balance").notNull(),
  otherFacilities: text("other_facilities"),
  slug: text("slug").notNull().unique(),
});

export type Account_Select = InferSelectModel<typeof branches>;
export type Account_Insert = InferInsertModel<typeof branches>;
