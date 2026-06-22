import pg from "pg";

const connectionString =
  process.env.SUPABASE_DB_URL ??
  "postgresql://postgres:TOQWdZXmCmYenpLN@db.evrklfqdyptuelulgcdy.supabase.co:5432/postgres";

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

for (const query of [
  `select table_schema, table_name from information_schema.tables where table_schema in ('vault','auth','extensions') order by 1,2`,
  `select name from vault.secrets limit 20`,
]) {
  try {
    const result = await client.query(query);
    console.log(query.split("\n")[0], result.rows);
  } catch (error) {
    console.log("ERR", query.split("\n")[0], error.message);
  }
}

await client.end();
