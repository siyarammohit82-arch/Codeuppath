import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const isSupabaseDatabase = connectionString?.includes(".supabase.co");

const isVercel = Boolean(process.env.VERCEL);

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: isSupabaseDatabase ? { rejectUnauthorized: false } : undefined,
      max: isVercel ? 1 : 10,
      idleTimeoutMillis: isVercel ? 10000 : 30000,
      connectionTimeoutMillis: 10000,
    })
  : null;
export const db = pool ? drizzle(pool, { schema }) : null;

pool?.on("error", (error) => {
  console.error("[db] unexpected pool error", error);
});
