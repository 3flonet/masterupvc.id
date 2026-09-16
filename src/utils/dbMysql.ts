import mysql from "mysql2/promise";

const globalForMysql = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

export function getMysqlPool() {
  if (globalForMysql.mysqlPool) return globalForMysql.mysqlPool;

  const host = process.env.MYSQL_HOST || "localhost";
  const port = Number(process.env.MYSQL_PORT) || 3306;
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";
  const database = process.env.MYSQL_DATABASE || "masterupvc";

  try {
    const newPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });

    globalForMysql.mysqlPool = newPool;
    return newPool;
  } catch (err) {
    console.error("Failed to initialize MySQL pool:", err);
    return null;
  }
}

export async function executeQuery(query: string, values: any[] = []): Promise<any> {
  const pool = getMysqlPool() || globalForMysql.mysqlPool;
  if (!pool) {
    throw new Error("MySQL connection pool is offline.");
  }
  const [rows] = await pool.execute(query, values);
  return rows;
}
