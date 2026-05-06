import { Table, InteractiveTable } from '../src';

const data = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: ['Engineer', 'PM', 'Designer', 'QA'][i % 4],
  status: i % 3 === 0 ? 'Inactive' : 'Active',
  score: Math.round(Math.random() * 100),
}));

const table = new Table();
table.addColumn({ name: 'ID', key: 'id', width: 5 });
table.addColumn({ name: 'Name', key: 'name', width: 18 });
table.addColumn({ name: 'Role', key: 'role', width: 12 });
table.addColumn({ name: 'Status', key: 'status', width: 10 });
table.addColumn({ name: 'Score', key: 'score', width: 8 });
table.addRows(data);

const tui = new InteractiveTable(table, {
  pageSize: 10,
  onSelect: (rows) => {
    console.log(`\nSelected ${rows.length} row(s):`);
    rows.forEach((r) => console.log(`  • ${r.name} (${r.role})`));
    process.exit(0);
  },
  onExit: () => {
    console.log('\nExited without selection.');
    process.exit(0);
  },
});

tui.start();
