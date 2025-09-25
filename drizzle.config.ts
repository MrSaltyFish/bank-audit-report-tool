import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const connString =
    process.env.DATABASE_URL ??
    "postgresql://postgres.erclxktttxrtsnyedmzg:thisisapassword@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

export default defineConfig({
    out: "./drizzle/migrations",
    schema: "./src/db/schema/index.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: connString,
    },
});
