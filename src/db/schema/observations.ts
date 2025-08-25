import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { pgTable, text, uuid, PgColumn } from "drizzle-orm/pg-core";

import "dotenv/config";
import { accounts } from "@db/schema/accounts";

export const observations = pgTable("observations", {
    id: uuid("id").primaryKey().defaultRandom(),
    accountId: uuid("account_id")
        .references(
            (): PgColumn => {
                return accounts.id;
            },
            { onDelete: "cascade", onUpdate: "cascade" },
        )
        .notNull(),
    query: text("query").notNull(),
    details: text("details"),
    slug: text("slug").notNull().unique(),
});

export type Observation_Select = InferSelectModel<typeof observations>;
export type Observation_Insert = InferInsertModel<typeof observations>;
