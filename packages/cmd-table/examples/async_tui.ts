import { Table, AsyncInteractiveTable, IDataSource } from '../src';

// Simulated API
class UserApi implements IDataSource {
    private totalUsers = 1000;

    async count(): Promise<number> {
        return new Promise(resolve => {
            setTimeout(() => resolve(this.totalUsers), 500); // Simulate network latency
        });
    }

    async getRows(offset: number, limit: number): Promise<any[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                const rows = [];
                for (let i = 0; i < limit; i++) {
                    const id = offset + i + 1;
                    if (id > this.totalUsers) break;
                    rows.push({
                        id,
                        name: `User ${id}`,
                        email: `user${id}@example.com`,
                        role: id % 5 === 0 ? 'Admin' : 'User',
                        status: Math.random() > 0.5 ? 'Active' : 'Inactive'
                    });
                }
                resolve(rows);
            }, 800); // Simulate network latency
        });
    }

    // Optional: Mock server-side filtering
    filter(query: string): void {
        console.log(`[Server] Filtering by "${query}"...`);
    }
}

async function main() {
    const tableTemplate = new Table({
        columns: [
            { name: 'ID', key: 'id' },
            { name: 'Name', key: 'name' },
            { name: 'Email', key: 'email' },
            { name: 'Role', key: 'role' },
            { name: 'Status', key: 'status' }
        ]
    });

    const api = new UserApi();
    const app = new AsyncInteractiveTable(api, tableTemplate, {
        pageSize: 5,
        onExit: () => {
            console.log('Exited.');
            process.exit(0);
        }
    });

    console.log('Starting Async Table...');
    await app.start();
}

main();
