import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const connString = process.env.DATABASE_URL ?? "NO STRING";

export default defineConfig({
    out: "./drizzle/migrations",
    schema: "./src/db/schema/index.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: connString,
    },
});
