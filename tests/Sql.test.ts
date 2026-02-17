import Database from 'better-sqlite3';
import { SqlDataSource } from '../src/integrations/sql';

describe('SqlDataSource', () => {
    let db: any;
    let ds: SqlDataSource;

    beforeAll(() => {
        db = new Database(':memory:');
        db.exec(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                age INTEGER NOT NULL
            )
        `);
        const insert = db.prepare('INSERT INTO users (name, age) VALUES (?, ?)');
        const insertMany = db.transaction(() => {
            insert.run('Alice', 30);
            insert.run('Bob', 25);
            insert.run('Charlie', 35);
            insert.run('Diana', 28);
            insert.run('Eve', 32);
        });
        insertMany();
        ds = new SqlDataSource(db, 'users');
    });

    afterAll(() => {
        db.close();
    });

    test('count() returns total rows', async () => {
        const count = await ds.count();
        expect(count).toBe(5);
    });

    test('getRows() returns correct slice', async () => {
        const rows = await ds.getRows(0, 2);
        expect(rows).toHaveLength(2);
        expect(rows[0].name).toBe('Alice');
        expect(rows[1].name).toBe('Bob');
    });

    test('getRows() with offset', async () => {
        const rows = await ds.getRows(3, 10);
        expect(rows).toHaveLength(2); // Only Diana and Eve left
        expect(rows[0].name).toBe('Diana');
    });

    test('sort() changes order', async () => {
        ds.sort('age', 'desc');
        const rows = await ds.getRows(0, 3);
        expect(rows[0].name).toBe('Charlie'); // age 35
        expect(rows[1].name).toBe('Eve');     // age 32
        expect(rows[2].name).toBe('Alice');   // age 30
        // Reset sort
        ds.sort('id', 'asc');
    });

    test('filter() narrows results', async () => {
        ds.filter('Ali');
        const count = await ds.count();
        expect(count).toBe(1);
        const rows = await ds.getRows(0, 10);
        expect(rows[0].name).toBe('Alice');
        // Clear filter
        ds.filter('');
    });

    test('filter("") clears filter', async () => {
        ds.filter('');
        const count = await ds.count();
        expect(count).toBe(5);
    });
});
