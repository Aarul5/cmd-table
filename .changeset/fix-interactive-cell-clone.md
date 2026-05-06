---
'cmd-table': patch
---

Fix `InteractiveTable` rendering crash when rows are selected. The selection-highlight code cloned cells with a plain object spread (`{...cell}`), which dropped the `Cell` prototype and made the downstream renderer fail at `cell.getString()` during column-width calculation. Highlighted cells are now constructed via the `Cell` class so all methods are preserved.

Also adds 69 new tests covering `InteractiveTable` and `AsyncInteractiveTable` (coverage 1.86% → 94.63% and 2.63% → 92.59% respectively), which is how the bug surfaced.
