import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must be set to connect to PostgreSQL.");
}

export const client = new Client({ connectionString });

export const db = drizzle(client, { schema });

let connected = false;

export async function connectDatabase() {
  if (!connected) {
    await client.connect();
    connected = true;
  }

  return db;
}
