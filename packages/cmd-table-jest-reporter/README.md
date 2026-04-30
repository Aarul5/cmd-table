# cmd-table-jest-reporter

A Jest custom reporter that replaces the default test output with a clean, structured table summary powered by [cmd-table](https://github.com/Aarul5/cmd-table). Instead of a wall of text, you get a compact suite-level summary, an optional per-test breakdown, and a slowest-tests leaderboard — all rendered as formatted ASCII tables in your terminal.

## Install

```bash
npm install cmd-table-jest-reporter
```

## Configuration

In your `jest.config.js`, replace (or extend) the default reporters:

```js
module.exports = {
  reporters: [['cmd-table-jest-reporter', { verbose: false, showSlowest: 5 }]],
};
```

To keep Jest's default output alongside the table summary:

```js
module.exports = {
  reporters: ['default', ['cmd-table-jest-reporter', { verbose: true, showSlowest: 3 }]],
};
```

## Options

| Option        | Type      | Default     | Description                                                                 |
| ------------- | --------- | ----------- | --------------------------------------------------------------------------- |
| `verbose`     | `boolean` | `false`     | Show a per-test breakdown table in addition to the suite summary            |
| `showSlowest` | `number`  | `0`         | Show the N slowest tests in a ranked table. Set to `0` to disable           |
| `failOnly`    | `boolean` | `false`     | In verbose mode, only show failed tests (ignored when `verbose` is `false`) |
| `theme`       | `string`  | `undefined` | Reserved for future theming support                                         |

## Example Output

After your test run completes, the reporter prints:

```
┌─────────────────────┬───┬──────┬──────┬──────┬──────────┐
│ Suite               │   │ Pass │ Fail │ Skip │ Duration │
├─────────────────────┼───┼──────┼──────┼──────┼──────────┤
│ auth.test.ts        │ ✅ │    8 │    0 │    1 │   600ms  │
│ api.test.ts         │ ✅ │    2 │    0 │    0 │   900ms  │
├─────────────────────┼───┼──────┼──────┼──────┼──────────┤
│                     │   │   10 │    0 │    1 │          │
└─────────────────────┴───┴──────┴──────┴──────┴──────────┘

✅ PASSED — 10 passed, 0 failed, 1 skipped in 1.50s
```

With `verbose: true`, an additional per-test table is shown:

```
┌──────────────┬────────────────┬────────┬──────────┐
│ Suite        │ Test           │ Status │ Duration │
├──────────────┼────────────────┼────────┼──────────┤
│ auth.test.ts │ login works    │ ✅     │   120ms  │
│ auth.test.ts │ logout works   │ ⏭      │     0ms  │
│ api.test.ts  │ GET /users     │ ✅     │   350ms  │
│ api.test.ts  │ POST /users    │ ✅     │   200ms  │
└──────────────┴────────────────┴────────┴──────────┘
```

With `showSlowest: 3`, the slowest tests are ranked:

```
┌────────────────┬──────────────┬──────────┐
│ Slowest Tests  │ Suite        │ Duration │
├────────────────┼──────────────┼──────────┤
│ GET /users     │ api.test.ts  │   350ms  │
│ POST /users    │ api.test.ts  │   200ms  │
│ login works    │ auth.test.ts │   120ms  │
└────────────────┴──────────────┴──────────┘
```

## License

MIT
