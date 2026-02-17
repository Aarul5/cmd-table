# SQL Integration

Browse real SQLite database tables interactively using the built-in `SqlDataSource` adapter.

## Prerequisites

Install `better-sqlite3` (the only optional peer dependency):

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3  # For TypeScript
```

## Quick Start

```ts
import Database from 'better-sqlite3';
import { Table, AsyncInteractiveTable, SqlDataSource } from 'cmd-table';

// 1. Open database
const db = new Database('company.db');

// 2. Create data source from a table
const source = new SqlDataSource(db, 'employees');

// 3. Define column template
const template = new Table();
template.addColumn('id');
template.addColumn('name');
template.addColumn('department');
template.addColumn('salary');

// 4. Launch interactive browser
const app = new AsyncInteractiveTable(source, template);
await app.start();

// 5. Clean up
db.close();
```

## Features

`SqlDataSource` implements the full `IDataSource` interface:

| Feature | Description |
|---|---|
| **Pagination** | Fetches rows on demand using `LIMIT` / `OFFSET` |
| **Sorting** | Server-side `ORDER BY` when you press `s` in the TUI |
| **Filtering** | Full-text `LIKE` search across all columns when you press `/` |
| **Count** | Efficient `SELECT COUNT(*)` for total row count |

## How It Works

```
User presses '→' (next page)
    → AsyncInteractiveTable calls source.getRows(offset, limit)
    → SqlDataSource runs: SELECT * FROM employees LIMIT 20 OFFSET 20
    → Results rendered in the TUI

User presses 's' (sort)
    → source.sort('name', 'asc')
    → SqlDataSource runs: SELECT * FROM employees ORDER BY name ASC
    → Data re-fetched for current page

User types '/eng' (search)
    → source.filter('eng')
    → SqlDataSource runs: SELECT * FROM employees WHERE name LIKE '%eng%' OR department LIKE '%eng%' OR ...
    → Filtered results displayed
```

## SqlDataSource API

```ts
class SqlDataSource implements IDataSource {
    constructor(db: Database.Database, tableName: string);

    count(): Promise<number>;
    getRows(offset: number, limit: number): Promise<Record<string, any>[]>;
    sort(column: string, direction: 'asc' | 'desc'): Promise<void>;
    filter(query: string): Promise<void>;
}
```

## Complete Demo

The repository includes a full demo that creates a database, seeds 10,000 employees, and launches the TUI:

```bash
npx ts-node examples/sqlite_demo.ts
```

The demo:
1. Creates an in-memory SQLite database
2. Seeds 10,000 employee records (name, department, salary, hire date)
3. Opens `AsyncInteractiveTable` for browsing
4. Supports pagination, sorting by any column, and text search

## Custom SQL Sources

You can also build your own `IDataSource` for more complex SQL:

```ts
class CustomSqlSource implements IDataSource {
    constructor(private db: Database.Database) {}

    async count() {
        const row = this.db.prepare(`
            SELECT COUNT(*) as total FROM orders
            WHERE status = 'active'
        `).get() as any;
        return row.total;
    }

    async getRows(offset: number, limit: number) {
        return this.db.prepare(`
            SELECT o.id, c.name, o.amount, o.status
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.status = 'active'
            LIMIT ? OFFSET ?
        `).all(limit, offset) as any[];
    }
}
```
