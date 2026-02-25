import postgres from 'postgres';

let connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_ERBZfAWg79jd@ep-delicate-flower-a1k2s9gj-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

// Remove psql prefix if present (common mistake when copying from Neon)
if (connectionString.startsWith('psql "') && connectionString.endsWith('"')) {
  connectionString = connectionString.slice(6, -1);
} else if (connectionString.startsWith("psql '") && connectionString.endsWith("'")) {
  connectionString = connectionString.slice(6, -1);
} else if (connectionString.startsWith('psql ')) {
  connectionString = connectionString.slice(5);
}

let sql: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any

export function getSql() {
  if (!sql) {
    sql = postgres(connectionString);
  }
  return sql;
}

export default getSql;
