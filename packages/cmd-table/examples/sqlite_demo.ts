/**
 * SQLite Demo — Browse a real database table with AsyncInteractiveTable
 * 
 * Run: npx ts-node examples/sqlite_demo.ts
 */
import Database from 'better-sqlite3';
import { Table, AsyncInteractiveTable } from '../src';
import { SqlDataSource } from '../src/integrations/sql';

// 1. Create in-memory database
const db = new Database(':memory:');

// 2. Create table and seed with 10,000 rows
db.exec(`
    CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        department TEXT NOT NULL,
        salary INTEGER NOT NULL
    )
`);

const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Support', 'Legal'];
const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank', 'Iris', 'Jack'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

const insert = db.prepare('INSERT INTO employees (name, email, department, salary) VALUES (?, ?, ?, ?)');
const insertMany = db.transaction(() => {
    for (let i = 0; i < 10_000; i++) {
        const first = firstNames[i % firstNames.length];
        const last = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
        const name = `${first} ${last}`;
        const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@company.com`;
        const dept = departments[i % departments.length];
        const salary = 40_000 + Math.floor(Math.random() * 100_000);
        insert.run(name, email, dept, salary);
    }
});
insertMany();

console.log('✅ Seeded 10,000 employees into in-memory SQLite database.');

// 3. Create table template
const tableTemplate = new Table({
    columns: [
        { name: 'ID', key: 'id' },
        { name: 'Name', key: 'name' },
        { name: 'Email', key: 'email' },
        { name: 'Department', key: 'department' },
        { name: 'Salary', key: 'salary' }
    ]
});

// 4. Launch the TUI
const dataSource = new SqlDataSource(db, 'employees');
const app = new AsyncInteractiveTable(dataSource, tableTemplate, {
    pageSize: 15,
    onExit: () => {
        db.close();
        console.log('Database closed. Goodbye!');
        process.exit(0);
    }
});

console.log('Launching interactive table browser...\n');
app.start();
