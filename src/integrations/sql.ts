import { IDataSource } from '../IDataSource';

/**
 * SqlDataSource — an IDataSource adapter for SQL databases.
 * Uses `better-sqlite3` for synchronous SQLite queries, wrapped in Promises
 * to satisfy the async IDataSource interface.
 *
 * Usage:
 * ```ts
 * import Database from 'better-sqlite3';
 * const db = new Database(':memory:');
 * const ds = new SqlDataSource(db, 'employees');
 * const app = new AsyncInteractiveTable(ds, tableTemplate);
 * app.start();
 * ```
 */
export class SqlDataSource implements IDataSource<Record<string, any>> {
    private db: any; // better-sqlite3 Database instance
    private tableName: string;
    private orderBy: string = '';
    private whereClause: string = '';

    constructor(db: any, tableName: string) {
        this.db = db;
        this.tableName = tableName;
    }

    async count(): Promise<number> {
        const sql = `SELECT COUNT(*) as c FROM ${this.tableName}${this.whereClause}`;
        const row = this.db.prepare(sql).get() as { c: number };
        return row.c;
    }

    async getRows(offset: number, limit: number): Promise<Record<string, any>[]> {
        const sql = `SELECT * FROM ${this.tableName}${this.whereClause}${this.orderBy} LIMIT ? OFFSET ?`;
        return this.db.prepare(sql).all(limit, offset) as Record<string, any>[];
    }

    sort(column: string, direction: 'asc' | 'desc'): void {
        this.orderBy = ` ORDER BY ${column} ${direction.toUpperCase()}`;
    }

    filter(query: string): void {
        if (!query) {
            this.whereClause = '';
            return;
        }
        // Get column names from table info
        const columns = this.db.pragma(`table_info(${this.tableName})`) as { name: string }[];
        const conditions = columns.map((col: { name: string }) => `${col.name} LIKE '%${query}%'`);
        this.whereClause = ` WHERE ${conditions.join(' OR ')}`;
    }
}
