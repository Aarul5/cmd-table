# cmd-table-vitest-reporter

A Vitest custom reporter that replaces the default test output with a beautiful, structured table summary powered by [cmd-table](https://github.com/Aarul5/cmd-table). It renders a per-suite summary on every test run, with optional verbose per-test rows and a slowest-tests breakdown — making it easy to spot failures and performance regressions at a glance.

## Install

```bash
npm install cmd-table cmd-table-vitest-reporter
```

## Configuration

In `vitest.config.ts`:

```ts
import CmdTableReporter from 'cmd-table-vitest-reporter';

export default {
  test: {
    reporters: [new CmdTableReporter({ verbose: false, showSlowest: 5 })],
  },
};
```

## Options

| Option        | Type      | Default     | Description                                                    |
| ------------- | --------- | ----------- | -------------------------------------------------------------- |
| `verbose`     | `boolean` | `false`     | Show a row-per-test table in addition to the suite summary     |
| `showSlowest` | `number`  | `undefined` | Render a "Slowest N Tests" table sorted by descending duration |
| `failOnly`    | `boolean` | `false`     | In verbose mode, only show failed tests                        |
| `theme`       | `string`  | `undefined` | Optional theme name passed through to cmd-table                |

## Watch mode

In watch mode, `cmd-table-vitest-reporter` prints a `--- Re-running tests ---` divider before each re-run so the output stays easy to follow in a long-running terminal session.
