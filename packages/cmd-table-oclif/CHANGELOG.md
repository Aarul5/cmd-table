# Changelog

## 0.1.2

### Patch Changes

- Updated dependencies [8bc58bb]
  - cmd-table@1.6.0

## [0.1.1] - 2026-04-30

### Fixed

- Moved `cmd-table` from `peerDependencies` to `dependencies` so it installs automatically. Users now only need `npm install cmd-table-oclif`.

## [0.1.0] - 2026-04-30

### Initial Release

- `renderTable(data, options)` — render data as a cmd-table inside oclif commands.
- `tableFlags` — pre-built oclif flags (`--columns`, `--output`, `--filter`, `--sort`, `--no-header`) for drop-in `cli-ux` table replacement.
- Supports `table | csv | json | md` output formats.
