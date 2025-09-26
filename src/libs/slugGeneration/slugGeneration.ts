import { nanoid } from "nanoid"; // npm install nanoid
import slugify from "slugify";
import { db } from "@db/connectDB";
import { accounts } from "@db/schema";
import { eq } from "drizzle-orm";

// Generate unique slug
export async function generateUniqueSlug(name: string) {
  let slug = slugify(name);
  let exists = await db
    .select()
    .from(accounts)
    .where(eq(accounts.slug, slug))
    .then((res) => res.length > 0);

  while (exists) {
    slug = `${slugify(name)}-${nanoid(4)}`; // append short random string
    exists = await db
      .select()
      .from(accounts)
      .where(eq(accounts.slug, slug))
      .then((res) => res.length > 0);
  }

  return slug;
}
