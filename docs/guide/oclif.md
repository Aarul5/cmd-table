# oclif Integration

`cmd-table-oclif` provides a drop-in replacement for `cli-ux table` using cmd-table's rendering engine.

## Installation

```bash
npm install cmd-table-oclif
```

## Usage

```ts
import { renderTable, tableFlags } from 'cmd-table-oclif'
import { Command, Flags } from '@oclif/core'

export default class Users extends Command {
  static flags = {
    ...tableFlags,
  }

  async run() {
    const { flags } = await this.parse(Users)
    const users = await fetchUsers()
    renderTable(users, flags)
  }
}
```

## Flags

`tableFlags` adds these flags to any oclif command:

| Flag | Description |
|------|-------------|
| `--columns` | Comma-separated list of columns to display |
| `--output` | Output format: `table`, `csv`, `json`, `md` |
| `--no-header` | Hide the table header row |
| `--filter` | Filter rows (e.g. `--filter="name=alice"`) |
| `--sort` | Sort by column (prefix with `-` for descending) |

## Migrating from cli-ux

```diff
-import { CliUx } from '@oclif/core'
+import { renderTable, tableFlags } from 'cmd-table-oclif'

 export default class MyCommand extends Command {
   static flags = {
-    ...CliUx.table.flags(),
+    ...tableFlags,
   }

   async run() {
     const { flags } = await this.parse(MyCommand)
-    CliUx.table(data, columns, flags)
+    renderTable(data, flags)
   }
 }
```
