import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { pgTable, text, uuid, PgColumn } from "drizzle-orm/pg-core";

import "dotenv/config";
import { users } from "@db/schema/users";

export const banks = pgTable("banks", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .references(
            (): PgColumn => {
                return users.id;
            },
            { onDelete: "cascade", onUpdate: "cascade" },
        )
        .notNull(),
    bankName: text("bank_name").notNull(),
    slug: text("slug").notNull().unique(),
});

export type Bank_Select = InferSelectModel<typeof banks>;
export type Bank_Insert = InferInsertModel<typeof banks>;
