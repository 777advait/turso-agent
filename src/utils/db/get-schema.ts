import { db } from "@/database";
import type { Value } from "@libsql/client";

type TSchema = {
  name: Value;
  type: Value;
  defaultValue?: Value;
};

export async function getDatabaseSchema() {
  const result = await db.execute(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
  );

  const tables = result.rows.map((row) => row.name);
  const schema: Record<string, TSchema[]> = {};

  for (const table of tables) {
    const info = await db.execute(`PRAGMA table_info(${table})`);

    const tableName = table?.toString();

    if (!tableName) continue;

    schema[tableName] = info.rows.map((row) => ({
      name: row.name,
      type: row.type,
      ...(row.dflt_value ? { defaultValue: row.dflt_value } : {}),
    }));
  }

  return schema;
}
