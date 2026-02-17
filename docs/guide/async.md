# Async Data Loading

For very large datasets — databases, REST APIs, or file-based storage — loading everything into memory isn't practical. The `AsyncInteractiveTable` fetches data **page by page** on demand.

## The IDataSource Interface

Implement this interface to connect any data source:

```ts
interface IDataSource {
    /** Total number of rows available */
    count(): Promise<number>;

    /** Fetch a slice of rows */
    getRows(offset: number, limit: number): Promise<Record<string, any>[]>;

    /** Optional: sort server-side */
    sort?(column: string, direction: 'asc' | 'desc'): Promise<void>;

    /** Optional: filter server-side */
    filter?(query: string): Promise<void>;
}
```

::: tip
`sort()` and `filter()` are **optional**. If not implemented, sorting and search are disabled in the TUI. Implement them to enable full server-side operations.
:::

## Basic Example

```ts
import { Table, AsyncInteractiveTable, IDataSource } from 'cmd-table';

class UserApi implements IDataSource {
    private users = Array.from({ length: 500 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: ['Admin', 'Editor', 'Viewer'][i % 3]
    }));

    async count() {
        return this.users.length;
    }

    async getRows(offset: number, limit: number) {
        return this.users.slice(offset, offset + limit);
    }

    async sort(column: string, direction: 'asc' | 'desc') {
        this.users.sort((a, b) => {
            const valA = a[column as keyof typeof a];
            const valB = b[column as keyof typeof b];
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    async filter(query: string) {
        // Re-filter from original data based on query
    }
}

// Define the table template (columns only)
const template = new Table();
template.addColumn('id');
template.addColumn('name');
template.addColumn('email');
template.addColumn('role');

const app = new AsyncInteractiveTable(new UserApi(), template);
app.start();
```

## REST API Example

Connect to a real REST API:

```ts
class RestDataSource implements IDataSource {
    private baseUrl: string;
    private total = 0;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async count() {
        const res = await fetch(`${this.baseUrl}/count`);
        const data = await res.json();
        this.total = data.total;
        return this.total;
    }

    async getRows(offset: number, limit: number) {
        const res = await fetch(`${this.baseUrl}/data?skip=${offset}&take=${limit}`);
        return res.json();
    }

    async sort(column: string, direction: 'asc' | 'desc') {
        // Server handles sorting via query params
        // The next getRows() call will include the sorted results
    }

    async filter(query: string) {
        // Server handles filtering
    }
}
```

## How It Works

1. On startup, `count()` is called to determine total rows
2. `getRows(0, pageSize)` fetches the first page
3. When the user navigates to page 2, `getRows(pageSize, pageSize)` is called
4. When user presses `s` to sort, `sort()` is called, then data is re-fetched
5. When user types in search mode, `filter()` is called

The TUI shows a loading indicator while fetching. Navigation keys are the same as `InteractiveTable`.

## SQL Integration

For SQLite databases, use the built-in `SqlDataSource` — see [SQL Integration](/guide/sql).
