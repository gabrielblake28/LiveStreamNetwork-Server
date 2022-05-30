import pg, { Pool, PoolConfig } from "pg";

pg.types.setTypeParser(1114, function (stringValue) {
    return new Date(Date.parse(stringValue + "+0000"));
});

let config: PoolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    max: 1,
};

const pool = new Pool(config);

const testQuery = async (text: string, params: any) => {
    const client = await pool.connect();

    await client.query("BEGIN");
    const results = await client.query(text, params);
    await client.query("ROLLBACK");
    client.release();
    return results;
};

export function query(text: string, params: any): any {
    return pool.query(text, params);
}
