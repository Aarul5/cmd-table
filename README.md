# cmd-table monorepo

This repository is a pnpm monorepo for the `cmd-table` ecosystem.

## Packages

| Package                                                         | Description                                       | Version                                                                                                                   |
| --------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [cmd-table](packages/cmd-table)                                 | Core CLI table library                            | [![npm](https://img.shields.io/npm/v/cmd-table)](https://www.npmjs.com/package/cmd-table)                                 |
| [cmd-table-jest-reporter](packages/cmd-table-jest-reporter)     | Jest reporter that renders results as a cmd-table | [![npm](https://img.shields.io/npm/v/cmd-table-jest-reporter)](https://www.npmjs.com/package/cmd-table-jest-reporter)     |
| [cmd-table-vitest-reporter](packages/cmd-table-vitest-reporter) | Vitest reporter (watch-mode aware)                | [![npm](https://img.shields.io/npm/v/cmd-table-vitest-reporter)](https://www.npmjs.com/package/cmd-table-vitest-reporter) |
| [cmd-table-oclif](packages/cmd-table-oclif)                     | Drop-in `cli-ux` table replacement for oclif CLIs | [![npm](https://img.shields.io/npm/v/cmd-table-oclif)](https://www.npmjs.com/package/cmd-table-oclif)                     |
| [@cmd-table/reporter-core](packages/reporter-core)              | Shared rendering code for the test reporters      | _private_                                                                                                                 |

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

### Run the docs site

```bash
pnpm --filter cmd-table docs:dev
```

## Release Process

We use [Changesets](https://github.com/changesets/changesets) for versioning and publishing. **No more manual `release:` commits** — versioning, changelogs, and npm publishes are all driven by changeset files.

### Day-to-day flow

1. **Make your changes** in any package (`packages/cmd-table`, `packages/cmd-table-oclif`, etc.).
2. **Add a changeset** describing what changed:

   ```bash
   pnpm changeset
   ```

   The CLI walks you through:
   - Which packages changed (select with space, confirm with enter).
   - The bump type — `patch` for fixes, `minor` for new features, `major` for breaking changes.
   - A short summary that becomes the changelog entry.

   This creates a markdown file in `.changeset/` that you commit alongside your code.

3. **Open a PR** and merge it to `main` as usual.

### What happens after merge

The CI's **Release** job runs on every push to `main` and does one of two things:

- **If there are pending changesets:** it opens (or updates) a PR titled _"chore: version packages"_ that bumps the affected versions, updates each package's `CHANGELOG.md`, and removes the consumed `.changeset/*.md` files. Review and merge that PR when you're ready to ship.
- **If there are no pending changesets:** the job is a no-op.

When the **"chore: version packages"** PR merges, the same Release job sees the version bumps with no remaining changesets, and runs `changeset publish` — which calls `npm publish` for each updated package using your existing **Trusted Publishing OIDC** setup. No `NPM_TOKEN` secret needed.

### Quick reference

| What you want to do                    | Command                 |
| -------------------------------------- | ----------------------- |
| Document a change for the next release | `pnpm changeset`        |
| Preview what will be released          | `pnpm changeset status` |
| Manually bump versions (rare)          | `pnpm version-packages` |
| Manually publish (rare; CI does this)  | `pnpm release`          |

### CI requirements

PRs that touch `packages/*/src/` files **must include a changeset** — the `changeset-check` job will fail otherwise. Run `pnpm changeset` before pushing.

If a PR is purely chore/docs/test and shouldn't trigger a release, you can add an empty changeset:

```bash
pnpm changeset --empty
```

### First-time package setup

When publishing a brand-new package for the first time, configure **npm Trusted Publishing** for it on npmjs.com:

- Repository: `Aarul5/cmd-table`
- Workflow: `ci.yml`

Then merge the version PR — the Release job will publish it.
