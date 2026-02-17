# Async Loading (Pagination)

For very large datasets (databases, APIs), use `AsyncInteractiveTable` with an `IDataSource`. This allows you to fetch data page-by-page instead of loading everything into memory.

## Usage

Implement the `IDataSource` interface.

```ts
import { AsyncInteractiveTable, IDataSource } from 'cmd-table';

class MyApi implements IDataSource {
    async count() { 
        // return total number of rows
        return 1000; 
    }
    
    async getRows(offset: number, limit: number) { 
        // fetch specific page
        return fetch(`/api/data?skip=${offset}&take=${limit}`); 
    }
}

const app = new AsyncInteractiveTable(new MyApi(), new Table());
app.start();
```
