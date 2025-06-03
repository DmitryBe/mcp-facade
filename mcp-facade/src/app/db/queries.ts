import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { mcpServers } from "./schema";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getRegisteredMcpServers() {
  return db.select().from(mcpServers);
}

export async function registerMcpServer(name: string, url: string) {
  return db.insert(mcpServers).values({ name, url });
}

export async function unregisterMcpServer(name: string) {
  return db.delete(mcpServers).where(eq(mcpServers.name, name));
}

export async function getMcpServerByName(name: string) {
  return db
    .select()
    .from(mcpServers)
    .where(eq(mcpServers.name, name))
    .then((rows) => rows[0] ?? null);
}

export async function updateMcpServer(
  name: string,
  data: { name?: string; url?: string }
) {
  return db
    .update(mcpServers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(mcpServers.name, name));
}

export async function deleteMcpServerById(id: number) {
  return db.delete(mcpServers).where(eq(mcpServers.id, id));
}
