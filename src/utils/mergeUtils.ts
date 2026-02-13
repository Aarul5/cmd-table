import { Table } from '../Table';

export function mergeAdjacent(table: Table, columns?: string[]): void {
    const colIndices = columns
        ? columns.map(name => table.columns.findIndex(c => c.name === name || c.key === name)).filter(i => i >= 0)
        : table.columns.map((_, i) => i);

    if (colIndices.length === 0) return;

    // Vertical Merge
    // We iterate column by column
    colIndices.forEach(colIndex => {
        let lastRowIndex = 0;
        let lastCell = table.rows[0]?.cells[colIndex];

        for (let i = 1; i < table.rows.length; i++) {
            const currentCell = table.rows[i].cells[colIndex];

            // Check if content matches and styling is identical? 
            // For now just content.
            if (lastCell && currentCell && lastCell.content === currentCell.content) {
                // Merge
                lastCell.rowSpan = (lastCell.rowSpan || 1) + 1;
                currentCell.merged = true;
                // We don't remove the cell, but LayoutManager will handle overlapping if we do it right?
                // LayoutManager expects cells to exist but be "covered".
                // However, Table.rows[i].cells[colIndex] is the cell object.
                // If we increase rowSpan of row[last].cell, then row[current].cell usually becomes "ignored" by LayoutManager
                // IF we properly mark it? 
                // LayoutManager logic:
                // "while (isOccupied(colIndex, rowIndex)) colIndex++"
                // It iterates row by row.
                // If row 0 has rowspan 2.
                // In row 1, col 0 is occupied.
                // So LayoutManager skips col 0 for row 1 content?
                // NO. LayoutManager places `row.cells[0]` into the *next available slot*.
                // If col 0 is occupied, it puts `row.cells[0]` into col 1.
                // DESIGN FLAW? 
                // If I have a vertical span, the next row's FIRST defined cell will be pushed to the right.
                // So I MUST remove the cell from the next row, or replace it with a dummy that LayoutManager knows to ignore?
                // Or I can just set `currentCell.colSpan = 0`? (Not supported).
                // I can set `currentCell.content` to '' and `currentCell.colSpan = 0` if I supported that.

                // Inspect LayoutManager.ts:
                // It merely places cells.
                // if `colIndex + cell.colSpan > table.columns.length` -> valid check.
                // It does NOT check if the *content* matches.

                // If I want to merge, I effectively want the cell in row i to *disappear* so the span takes its place.
                // But Table.rows[i].cells is an array.
                // If I remove element at colIndex, all subsequent cells shift left. That breaks alignment.
                // So I should replace it with a special "Merged" marker?
                // Or simple: change `currentCell` to have `colSpan = 0`?

                // Let's look at LayoutManager again.
                // "while (isOccupied(colIndex, rowIndex)) { colIndex++; }"
                // If (0,0) has rowSpan 2.
                // (0,1) is occupied.
                // When processing Row 1:
                // It starts colIndex = 0. Occupied. colIndex becomes 1.
                // It takes `row.cells[0]` and puts it at (1,1).
                // This SHIFTS the data!

                // SOLUTION:
                // Auto-merge must assume that the data in Row 1 corresponds to Column 0 *semantically*.
                // But visualized, it should be hidden.
                // The `LayoutManager` is strictly grid-based.
                // If I want the span to cover (0,1), I must ensure Row 1 *skips* Column 0.
                // But `row.cells` is a dense array.
                // If I have `[A, B]` in Row 1. And Col 0 is spanned from above.
                // I want `A` to be *swallowed* (since it's identical).
                // And `B` to be in Col 1.
                // But LayoutManager will try to put `A` in Col 1 (since Col 0 is occupied).
                // So `A` appears in Col 1. `B` appears in Col 2.
                // Creates a mess.

                // FIX:
                // I need to modify `row.cells`. 
                // If I have a vertical merge in Col 0.
                // Row 1's cell at Col 0 must be *removed*?
                // No, Row 1 cells are indexed.
                // Row 1 `cells` array: `[Cell0, Cell1, Cell2]`.
                // If Col 0 is spanned, LayoutManager will put `Cell0` at Col 1.
                // WE NEED TO INSERT A DUMMY?
                // No. We need to DELETE the cell that is being merged.
                // So `row.cells.splice(colIndex, 1)`?
                // If I delete Cell0. `row.cells` becomes `[Cell1, Cell2]`.
                // LayoutManager:
                // Col 0 occupied.
                // Takes first cell (`Cell1`). Places at Col 1.
                // This is CORRECT! `Cell1` belongs in Col 1.

                // So verification:
                // Row 0: `[Span2, B]` -> Col 0 has span 2. Col 1 has B.
                // Row 1: `[Span2(duplicate), C]`
                // I want Row 1 to look like: `Col 0 (covered), Col 1 (C)`.
                // If I remove `Span2(duplicate)` from Row 1 cells.
                // Row 1 cells: `[C]`.
                // LayoutManager processing Row 1:
                // colIndex=0. Occupied (by Span2 from Row 0). colIndex -> 1.
                // Takes first cell (`C`). Places at colIndex 1.
                // Result: Col 1 has C.
                // This works!

                // IMPLEMENTATION DETAIL:
                // I must remove the cell from the array.
                // `table.rows[i].cells.splice(colIndex, 1)`?
                // CAREFUL: If I have multiple merges in one row.
                // Removing one changes indices of subsequent ones.
                // So I must iterate columns in REVERSE?
                // Or keep track of removals.
            } else {
                lastCell = currentCell;
                lastRowIndex = i;
            }
        }
    });
}
