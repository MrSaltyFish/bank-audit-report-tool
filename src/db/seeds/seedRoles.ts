// scripts/seedRoles.ts
import { db } from "@/db/connectDB";
import { roles } from "@/db/schema/roles";

async function seedRoles() {
  await db
    .insert(roles)
    .values([{ name: "user" }, { name: "admin" }])
    .onConflictDoNothing();
  console.log("Roles seeded ✅");
}
seedRoles().then(() => process.exit(0));
