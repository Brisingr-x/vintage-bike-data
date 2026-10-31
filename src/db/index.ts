import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

export const client = new Client(connectionString ? { connectionString } : {});

export const db = drizzle(client, { schema });

let connection: Promise<Client> | undefined;

export async function connectDatabase() {
  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to connect to PostgreSQL.");
  }

  connection ??= client.connect().catch((error: unknown) => {
    connection = undefined;
    throw error;
  });

  await connection;
  return db;
}
