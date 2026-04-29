# cmd-table monorepo

This repository is a pnpm monorepo for the `cmd-table` ecosystem.

## Packages

| Package                         | Description            | Version                                                                                   |
| ------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| [cmd-table](packages/cmd-table) | Core CLI table library | [![npm](https://img.shields.io/npm/v/cmd-table)](https://www.npmjs.com/package/cmd-table) |

## Development

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Setup

```bash
pnpm install
```

### Build all packages

```bash
pnpm -r build
```

### Test all packages

```bash
pnpm -r test
```

### Add a changeset (before releasing)

```bash
pnpm changeset
```

## Release Process

To release a package, merge a commit to `main` with the message:

```
release: <package-name> <version>
```

Example: `release: cmd-table 1.6.0`

This triggers CI to publish only the specified package to npm.
