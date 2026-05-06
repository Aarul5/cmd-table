import { Table, AsyncInteractiveTable, IDataSource } from '../src';

// Simulated API with server-side filtering and 1 000 rows
class UserApi implements IDataSource {
  private all = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 5 === 0 ? 'Admin' : 'User',
    status: i % 3 === 0 ? 'Inactive' : 'Active',
  }));

  private visible = this.all;

  async count(): Promise<number> {
    return new Promise((resolve) => setTimeout(() => resolve(this.visible.length), 300));
  }

  async getRows(offset: number, limit: number): Promise<any[]> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(this.visible.slice(offset, offset + limit)), 500),
    );
  }

  filter(query: string): void {
    const q = query.toLowerCase();
    this.visible = q ? this.all.filter((r) => r.name.toLowerCase().includes(q)) : this.all;
  }
}

async function main() {
  const template = new Table({
    columns: [
      { name: 'ID', key: 'id' },
      { name: 'Name', key: 'name' },
      { name: 'Email', key: 'email' },
      { name: 'Role', key: 'role' },
      { name: 'Status', key: 'status' },
    ],
  });

  const api = new UserApi();
  const app = new AsyncInteractiveTable(api, template, {
    pageSize: 10,
    onExit: () => {
      console.log('Goodbye.');
      process.exit(0);
    },
  });

  console.log('Loading async table… press [/] to filter, [q] to quit.');
  await app.start();
}

main();
