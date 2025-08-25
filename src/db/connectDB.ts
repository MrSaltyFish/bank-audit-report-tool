import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
});

export const client = postgres(connectionString, { prepare: false });
export const db = drizzle({ client: pool });
