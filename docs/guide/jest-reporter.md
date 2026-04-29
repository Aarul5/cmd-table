# Jest Reporter

`cmd-table-jest-reporter` renders your Jest test results as a formatted table in the terminal.

## Installation

```bash
npm install --save-dev cmd-table-jest-reporter
```

## Setup

Add to your `jest.config.js` or `jest.config.ts`:

```js
module.exports = {
  reporters: [
    ['cmd-table-jest-reporter', { verbose: true, showSlowest: 5 }],
  ],
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `verbose` | `boolean` | `false` | Show per-test result table |
| `showSlowest` | `number` | `0` | Show N slowest tests (0 = off) |
| `failOnly` | `boolean` | `false` | Verbose table shows only failed tests |
| `theme` | `string` | `'default'` | Table theme name |

## Migrating from the Default Jest Reporter

```js
// jest.config.js
module.exports = {
  reporters: [
    ['cmd-table-jest-reporter', { verbose: false }],
  ],
}
```

Remove the default `'default'` reporter entry if you had one explicitly set — Jest uses its default reporter unless overridden. Replacing it with this package gives you the same pass/fail summary in a table format.
