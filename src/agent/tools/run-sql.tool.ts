import { db } from "@/database";

export async function runSQL(query: string) {
  return await db.execute(query);
}
