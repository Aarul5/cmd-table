# cmd-table-vitest-reporter

A Vitest custom reporter that replaces the default test output with a beautiful, structured table summary powered by [cmd-table](https://github.com/Aarul5/cmd-table). It renders a per-suite summary on every test run, with optional verbose per-test rows and a slowest-tests breakdown — making it easy to spot failures and performance regressions at a glance.

## Install

```bash
npm install cmd-table-vitest-reporter
```

## Programmatic Usage

If you need to instantiate the reporter directly in code (instead of via the string-array config), import the named export:

```typescript
import { CmdTableVitestReporter } from 'cmd-table-vitest-reporter';

const reporter = new CmdTableVitestReporter({ verbose: true, showSlowest: 5 });
```

## Configuration

In `vitest.config.ts`:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: [['cmd-table-vitest-reporter', { verbose: true, showSlowest: 5 }]],
  },
});
```

## Options

| Option        | Type      | Default     | Description                                                    |
| ------------- | --------- | ----------- | -------------------------------------------------------------- |
| `verbose`     | `boolean` | `false`     | Show a row-per-test table in addition to the suite summary     |
| `showSlowest` | `number`  | `undefined` | Render a "Slowest N Tests" table sorted by descending duration |
| `failOnly`    | `boolean` | `false`     | In verbose mode, only show failed tests                        |
| `theme`       | `string`  | `undefined` | Optional theme name passed through to cmd-table                |

## Migrating from the Default Vitest Reporter

Remove the built-in reporter and plug in `cmd-table-vitest-reporter`:

```diff
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
-   // default reporter (no config needed — Vitest uses it automatically)
+   reporters: [['cmd-table-vitest-reporter', { verbose: true }]],
  },
})
```

No other changes are needed. The reporter reads the same test results Vitest produces.

## Watch mode

In watch mode, `cmd-table-vitest-reporter` prints a `--- Re-running tests ---` divider before each re-run so the output stays easy to follow in a long-running terminal session.
