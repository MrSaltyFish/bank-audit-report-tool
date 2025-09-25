import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { users } from "@db/schema/users";

// ------------------ Roles Table (join for many-to-many) ------------------
export const roles = pgTable("roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull().unique(), // e.g. "admin", "editor", "user"
});

export const userRoles = pgTable("user_roles", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	roleId: uuid("role_id")
		.notNull()
		.references(() => roles.id, { onDelete: "cascade" }),
});
