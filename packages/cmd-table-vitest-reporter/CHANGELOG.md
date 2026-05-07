# Changelog

## 0.1.2

### Patch Changes

- Updated dependencies [8bc58bb]
  - cmd-table@1.6.0

## [0.1.1] - 2026-04-30

### Fixed

- Moved `cmd-table` from `peerDependencies` to `dependencies` so it installs automatically. Users now only need `npm install cmd-table-vitest-reporter`.

## [0.1.0] - 2026-04-30

### Initial Release

- Vitest custom reporter rendering suite-level summaries, per-test breakdowns, slowest-tests leaderboard, and watch-mode reruns as formatted ASCII tables via cmd-table.
