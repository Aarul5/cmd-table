# Vitest Reporter

`cmd-table-vitest-reporter` renders your Vitest test results as a formatted table in the terminal.

## Installation

```bash
npm install --save-dev cmd-table-vitest-reporter
```

## Setup

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: [['cmd-table-vitest-reporter', { verbose: true, showSlowest: 5 }]],
  },
})
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `verbose` | `boolean` | `false` | Show per-test result table |
| `showSlowest` | `number` | `0` | Show N slowest tests (0 = off) |
| `failOnly` | `boolean` | `false` | Verbose table shows only failed tests |
| `theme` | `string` | `'default'` | Table theme name |

## Migrating from the Default Vitest Reporter

```diff
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
-   // default reporter (no config needed)
+   reporters: [['cmd-table-vitest-reporter', { verbose: true }]],
  },
})
```
