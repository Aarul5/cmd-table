---
'cmd-table': minor
---

Add row cursor navigation to `InteractiveTable`.

- **New:** `↑`/`↓` arrows move a cursor through the current page (cyan highlight)
- **Changed:** `Space` now toggles selection of the row under the cursor (individual toggle)
- **New:** `a` selects / deselects all displayed rows (previous `Space` behaviour)
- Cursor resets to row 0 on page change and after filter/sort
- Selected + cursor rows render in bold green; cursor-only in cyan; selected-only in green

Also raises test coverage: InteractiveTable 94% → 98%, AsyncInteractiveTable 92% → 99% (303 tests total).
