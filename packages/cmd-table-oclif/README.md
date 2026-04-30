# cmd-table-oclif

Drop-in replacement for `cli-ux` table in [oclif](https://oclif.io/) commands. Powered by [cmd-table](https://github.com/Aarul5/cmd-table), it renders rich terminal tables with support for CSV, JSON, and Markdown export — and ships a ready-made set of oclif flags so you can wire up table formatting in a single line.

## Install

```bash
npm install cmd-table-oclif
```

## Usage

```typescript
import { Command } from '@oclif/core';
import { renderTable, tableFlags } from 'cmd-table-oclif';

export default class Users extends Command {
  static flags = {
    ...tableFlags,
  };

  async run() {
    const { flags } = await this.parse(Users);

    const data = [
      { name: 'Alice', role: 'Dev', score: 95 },
      { name: 'Bob', role: 'PM', score: 80 },
    ];

    this.log(
      renderTable(data, {
        columns: flags.columns?.split(','),
        output: flags.output as 'table' | 'csv' | 'json' | 'md',
        filter: flags.filter,
        sort: flags.sort,
        noHeader: flags['no-header'],
      }),
    );
  }
}
```

## Flags

| Flag          | Type                   | Default | Description                                       |
| ------------- | ---------------------- | ------- | ------------------------------------------------- |
| `--columns`   | string                 | —       | Comma-separated list of columns to display        |
| `--output`    | `table\|csv\|json\|md` | `table` | Output format                                     |
| `--no-header` | boolean                | `false` | Hide the table header row                         |
| `--filter`    | string                 | —       | Filter rows by a search term (matches any column) |
| `--sort`      | string                 | —       | Sort rows by this column name                     |

## Migration from cli-ux.table

**Before** (cli-ux):

```typescript
import { ux } from '@oclif/core';

// Inside your command run():
ux.table(data, {
  name: { header: 'Name' },
  role: { header: 'Role' },
  score: { header: 'Score' },
});
```

**After** (cmd-table-oclif):

```typescript
import { renderTable, tableFlags } from 'cmd-table-oclif';

// Add to your command's static flags:
static flags = { ...tableFlags };

// Inside your command run():
const { flags } = await this.parse(MyCommand);
this.log(renderTable(data, {
  output: flags.output as 'table' | 'csv' | 'json' | 'md',
  filter: flags.filter,
  sort:   flags.sort,
}));
```

The key differences:

- `renderTable` returns a string — pass it to `this.log()` (or any output sink)
- Column definitions are inferred from object keys; override with `--columns`
- Output format, filtering, and sorting are all user-controllable via flags at runtime

## License

MIT
