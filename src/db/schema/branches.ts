import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { pgTable, text, uuid, PgColumn } from "drizzle-orm/pg-core";

import "dotenv/config";
import { banks } from "@db/schema/banks";

export const branches = pgTable("branches", {
    id: uuid("id").primaryKey().defaultRandom(),
    bankId: uuid("bank_id")
        .references(
            (): PgColumn => {
                return banks.id;
            },
            { onDelete: "cascade", onUpdate: "cascade" },
        )
        .notNull(),
    branchName: text("branch_name").notNull(),
    slug: text("slug").notNull().unique(),
});

export type Branch_Select = InferSelectModel<typeof branches>;
export type Branch_Insert = InferInsertModel<typeof branches>;
