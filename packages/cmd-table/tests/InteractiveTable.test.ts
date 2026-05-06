/**
 * InteractiveTable tests.
 *
 * Strategy: the class wires raw-mode stdin/stdout and readline, which doesn't
 * exist in Jest's environment. We stub the IO surface, then drive the private
 * state machine directly via `(t as any).method()` to exercise the logic.
 */

import { Table } from '../src/Table';
import { InteractiveTable } from '../src/InteractiveTable';

// Stub TTY-bound APIs before importing — readline.emitKeypressEvents is a no-op
// against a non-TTY stdin, but we still need to silence the side effects.
beforeAll(() => {
  // Pretend stdin is not a TTY so setRawMode is never called.
  Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
  // process.exit must not actually exit during tests.
  jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new Error(`process.exit(${code ?? 0}) called`);
  }) as never);
  // Silence rendering output.
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(process.stdout, 'write').mockImplementation((() => true) as any);
});

afterAll(() => {
  jest.restoreAllMocks();
});

const buildTable = () => {
  const t = new Table();
  t.addColumn({ name: 'Name', key: 'name' });
  t.addColumn({ name: 'Age', key: 'age' });
  t.addColumn({ name: 'Role', key: 'role' });
  t.addRow({ name: 'Alice', age: 30, role: 'Engineer' });
  t.addRow({ name: 'Bob', age: 25, role: 'Designer' });
  t.addRow({ name: 'Charlie', age: 35, role: 'PM' });
  t.addRow({ name: 'Diana', age: 28, role: 'Engineer' });
  return t;
};

describe('InteractiveTable — constructor & defaults', () => {
  test('uses default pageSize of 10', () => {
    const t = new InteractiveTable(buildTable());
    expect((t as any).pageSize).toBe(10);
  });

  test('honors custom pageSize', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    expect((t as any).pageSize).toBe(2);
  });

  test('starts in nav mode on page 1', () => {
    const t = new InteractiveTable(buildTable());
    expect((t as any).mode).toBe('nav');
    expect((t as any).currentPage).toBe(1);
  });

  test('seeds displayedRows from the source table', () => {
    const t = new InteractiveTable(buildTable());
    expect((t as any).displayedRows).toHaveLength(4);
  });
});

describe('InteractiveTable — pagination', () => {
  test('nextPage advances within bounds', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).applyFilterAndSort();
    (t as any).nextPage();
    expect((t as any).currentPage).toBe(2);
  });

  test('nextPage stops at the last page', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).applyFilterAndSort();
    (t as any).nextPage(); // 1 -> 2
    (t as any).nextPage(); // 2 -> 2 (clamped)
    expect((t as any).currentPage).toBe(2);
  });

  test('prevPage decrements within bounds', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).applyFilterAndSort();
    (t as any).nextPage();
    (t as any).prevPage();
    expect((t as any).currentPage).toBe(1);
  });

  test('prevPage stops at page 1', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).prevPage();
    expect((t as any).currentPage).toBe(1);
  });
});

describe('InteractiveTable — filter & sort', () => {
  test('search filters by case-insensitive substring across cells', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).searchQuery = 'engineer';
    (t as any).applyFilterAndSort();
    expect((t as any).displayedRows).toHaveLength(2);
  });

  test('clearing search restores all rows', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).searchQuery = 'alice';
    (t as any).applyFilterAndSort();
    (t as any).searchQuery = '';
    (t as any).applyFilterAndSort();
    expect((t as any).displayedRows).toHaveLength(4);
  });

  test('numeric column sorts numerically (asc)', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).sortColumnIndex = 1; // Age
    (t as any).sortDirection = 'asc';
    (t as any).applyFilterAndSort();
    const ages = (t as any).displayedRows.map((r: any) => Number(r.cells[1].content));
    expect(ages).toEqual([25, 28, 30, 35]);
  });

  test('numeric column sorts numerically (desc)', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).sortColumnIndex = 1;
    (t as any).sortDirection = 'desc';
    (t as any).applyFilterAndSort();
    const ages = (t as any).displayedRows.map((r: any) => Number(r.cells[1].content));
    expect(ages).toEqual([35, 30, 28, 25]);
  });

  test('string column sorts alphabetically', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).sortColumnIndex = 0; // Name
    (t as any).sortDirection = 'asc';
    (t as any).applyFilterAndSort();
    const names = (t as any).displayedRows.map((r: any) => String(r.cells[0].content));
    expect(names).toEqual(['Alice', 'Bob', 'Charlie', 'Diana']);
  });

  test('toggleSort flips direction and re-applies', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).sortDirection = 'asc';
    (t as any).toggleSort();
    expect((t as any).sortDirection).toBe('desc');
    (t as any).toggleSort();
    expect((t as any).sortDirection).toBe('asc');
  });

  test('applyFilterAndSort resets currentPage to 1', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).applyFilterAndSort();
    (t as any).nextPage();
    expect((t as any).currentPage).toBe(2);
    (t as any).searchQuery = 'a';
    (t as any).applyFilterAndSort();
    expect((t as any).currentPage).toBe(1);
  });
});

describe('InteractiveTable — keypress routing (nav mode)', () => {
  test('Ctrl+C calls stop', () => {
    const t = new InteractiveTable(buildTable());
    const stop = jest.spyOn(t, 'stop').mockImplementation(() => {});
    (t as any).handleKey('', { name: 'c', ctrl: true });
    expect(stop).toHaveBeenCalled();
  });

  test('"q" in nav mode calls stop', () => {
    const t = new InteractiveTable(buildTable());
    const stop = jest.spyOn(t, 'stop').mockImplementation(() => {});
    (t as any).handleKey('q', { name: 'q' });
    expect(stop).toHaveBeenCalled();
  });

  test('"/" enters search mode', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).handleKey('/', { name: 'slash' });
    expect((t as any).mode).toBe('search');
  });

  test('"c" enters columns mode', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).handleKey('c', { name: 'c' });
    expect((t as any).mode).toBe('columns');
    expect((t as any).columnSelectionIndex).toBe(0);
  });

  test('right-arrow advances pages', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).applyFilterAndSort();
    (t as any).handleKey('', { name: 'right' });
    expect((t as any).currentPage).toBe(2);
  });

  test('"n" advances pages', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).applyFilterAndSort();
    (t as any).handleKey('n', { name: 'n' });
    expect((t as any).currentPage).toBe(2);
  });

  test('"s" toggles sort direction', () => {
    const t = new InteractiveTable(buildTable());
    const initial = (t as any).sortDirection;
    (t as any).handleKey('s', { name: 's' });
    expect((t as any).sortDirection).not.toBe(initial);
  });

  test('space toggles select-all on the current page', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).applyFilterAndSort();
    (t as any).handleKey('a', { name: 'a' });
    expect((t as any).selectedRows.size).toBe(4);
    (t as any).handleKey('a', { name: 'a' });
    expect((t as any).selectedRows.size).toBe(0);
  });

  test('escape clears search query first, then selection', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).applyFilterAndSort();
    (t as any).handleKey('a', { name: 'a' });
    expect((t as any).selectedRows.size).toBe(4);

    (t as any).searchQuery = 'alice';
    (t as any).handleKey('', { name: 'escape' });
    expect((t as any).searchQuery).toBe('');
    expect((t as any).selectedRows.size).toBe(4); // selection still there

    (t as any).handleKey('', { name: 'escape' });
    expect((t as any).selectedRows.size).toBe(0); // now cleared
  });

  test('enter triggers onSelect with selected rows when present', () => {
    const onSelect = jest.fn();
    const t = new InteractiveTable(buildTable(), { onSelect });
    jest.spyOn(t, 'stop').mockImplementation(() => {});

    (t as any).applyFilterAndSort();
    (t as any).handleKey('a', { name: 'a' });
    (t as any).handleKey('', { name: 'return' });

    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][0]).toHaveLength(4);
  });

  test('enter falls back to all displayed rows when no selection', () => {
    const onSelect = jest.fn();
    const t = new InteractiveTable(buildTable(), { onSelect });
    jest.spyOn(t, 'stop').mockImplementation(() => {});

    (t as any).applyFilterAndSort();
    (t as any).handleKey('', { name: 'return' });

    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0][0]).toHaveLength(4);
  });
});

describe('InteractiveTable — search mode', () => {
  test('typing characters appends to searchQuery and re-filters', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'search';
    (t as any).handleKey('a', { name: 'a' });
    (t as any).handleKey('l', { name: 'l' });
    expect((t as any).searchQuery).toBe('al');
    // Filter applied: only Alice matches "al"
    expect((t as any).displayedRows.map((r: any) => r.cells[0].content)).toEqual(['Alice']);
  });

  test('backspace removes the last character', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'search';
    (t as any).searchQuery = 'ali';
    (t as any).handleKey('', { name: 'backspace' });
    expect((t as any).searchQuery).toBe('al');
  });

  test('enter exits search mode but keeps query', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'search';
    (t as any).searchQuery = 'alice';
    (t as any).handleKey('', { name: 'enter' });
    expect((t as any).mode).toBe('nav');
    expect((t as any).searchQuery).toBe('alice');
  });

  test('escape exits search mode and clears query', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'search';
    (t as any).searchQuery = 'alice';
    (t as any).handleKey('', { name: 'escape' });
    expect((t as any).mode).toBe('nav');
    expect((t as any).searchQuery).toBe('');
  });

  test('control characters do not pollute the query', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'search';
    (t as any).handleKey('a', { name: 'a', ctrl: true });
    expect((t as any).searchQuery).toBe('');
  });
});

describe('InteractiveTable — columns mode', () => {
  test('arrow keys navigate column index', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'columns';
    (t as any).handleKey('', { name: 'down' });
    expect((t as any).columnSelectionIndex).toBe(1);
    (t as any).handleKey('', { name: 'down' });
    expect((t as any).columnSelectionIndex).toBe(2);
    (t as any).handleKey('', { name: 'up' });
    expect((t as any).columnSelectionIndex).toBe(1);
  });

  test('arrow up/down clamps at edges', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'columns';
    (t as any).handleKey('', { name: 'up' }); // already 0
    expect((t as any).columnSelectionIndex).toBe(0);
    (t as any).columnSelectionIndex = 2; // last index (3 cols)
    (t as any).handleKey('', { name: 'down' });
    expect((t as any).columnSelectionIndex).toBe(2);
  });

  test('space toggles a column hidden / visible', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'columns';
    (t as any).columnSelectionIndex = 0; // "name"

    (t as any).handleKey(' ', { name: 'space' });
    expect((t as any).hiddenColumns.has('name')).toBe(true);

    (t as any).handleKey(' ', { name: 'space' });
    expect((t as any).hiddenColumns.has('name')).toBe(false);
  });

  test('enter exits to nav mode', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'columns';
    (t as any).handleKey('', { name: 'enter' });
    expect((t as any).mode).toBe('nav');
  });

  test('escape exits to nav mode', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'columns';
    (t as any).handleKey('', { name: 'escape' });
    expect((t as any).mode).toBe('nav');
  });
});

describe('InteractiveTable — render does not throw', () => {
  test('render draws current page in nav mode', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).applyFilterAndSort();
    expect(() => (t as any).render()).not.toThrow();
  });

  test('render draws columns selection screen', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).mode = 'columns';
    expect(() => (t as any).render()).not.toThrow();
  });

  test('render handles "all columns hidden" gracefully', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).hiddenColumns = new Set(['name', 'age', 'role']);
    expect(() => (t as any).render()).not.toThrow();
  });
});

describe('InteractiveTable — stop()', () => {
  test('invokes onExit callback when provided', () => {
    const onExit = jest.fn();
    const t = new InteractiveTable(buildTable(), { onExit });
    t.stop();
    expect(onExit).toHaveBeenCalled();
  });

  test('falls back to process.exit when no onExit provided', () => {
    const t = new InteractiveTable(buildTable());
    expect(() => t.stop()).toThrow(/process\.exit/);
  });
});

describe('InteractiveTable — cursor navigation', () => {
  test('down arrow moves cursor down', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 4 });
    (t as any).applyFilterAndSort();
    (t as any).handleKey('', { name: 'down' });
    expect((t as any).cursorIndex).toBe(1);
  });

  test('down arrow clamps at last row on page', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 4 });
    (t as any).applyFilterAndSort();
    (t as any).cursorIndex = 3; // last of 4 rows
    (t as any).handleKey('', { name: 'down' });
    expect((t as any).cursorIndex).toBe(3);
  });

  test('up arrow moves cursor up', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 4 });
    (t as any).applyFilterAndSort();
    (t as any).cursorIndex = 2;
    (t as any).handleKey('', { name: 'up' });
    expect((t as any).cursorIndex).toBe(1);
  });

  test('up arrow clamps at 0', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 4 });
    (t as any).applyFilterAndSort();
    (t as any).handleKey('', { name: 'up' });
    expect((t as any).cursorIndex).toBe(0);
  });

  test('space toggles selection of row at cursor', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 4 });
    (t as any).applyFilterAndSort();
    (t as any).cursorIndex = 1;
    (t as any).handleKey(' ', { name: 'space' });
    expect((t as any).selectedRows.size).toBe(1);
    const selectedRow = [...(t as any).selectedRows][0];
    expect(selectedRow.cells[0].content).toBe('Bob');
  });

  test('space deselects if row already selected', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 4 });
    (t as any).applyFilterAndSort();
    (t as any).cursorIndex = 0;
    (t as any).handleKey(' ', { name: 'space' });
    expect((t as any).selectedRows.size).toBe(1);
    (t as any).handleKey(' ', { name: 'space' });
    expect((t as any).selectedRows.size).toBe(0);
  });

  test('"a" selects all displayed rows', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).applyFilterAndSort();
    (t as any).handleKey('a', { name: 'a' });
    expect((t as any).selectedRows.size).toBe(4);
  });

  test('"a" deselects all when all already selected', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).applyFilterAndSort();
    (t as any).handleKey('a', { name: 'a' });
    (t as any).handleKey('a', { name: 'a' });
    expect((t as any).selectedRows.size).toBe(0);
  });

  test('cursor resets to 0 after page change', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 2 });
    (t as any).applyFilterAndSort();
    (t as any).cursorIndex = 1;
    (t as any).nextPage();
    expect((t as any).cursorIndex).toBe(0);
  });

  test('cursor resets to 0 after filter', () => {
    const t = new InteractiveTable(buildTable());
    (t as any).applyFilterAndSort();
    (t as any).cursorIndex = 2;
    (t as any).searchQuery = 'alice';
    (t as any).applyFilterAndSort();
    expect((t as any).cursorIndex).toBe(0);
  });

  test('render with cursor-only row does not throw', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 4 });
    (t as any).applyFilterAndSort();
    (t as any).cursorIndex = 1;
    expect(() => (t as any).render()).not.toThrow();
  });

  test('render with cursor+selected row does not throw', () => {
    const t = new InteractiveTable(buildTable(), { pageSize: 4 });
    (t as any).applyFilterAndSort();
    (t as any).cursorIndex = 0;
    (t as any).handleKey(' ', { name: 'space' });
    expect(() => (t as any).render()).not.toThrow();
  });
});

describe('InteractiveTable — start() and stop() TTY branch', () => {
  test('start() registers keypress listener on stdin', () => {
    const t = new InteractiveTable(buildTable());
    const stdinOn = jest
      .spyOn(process.stdin, 'on')
      .mockImplementation((() => process.stdin) as any);
    const stdoutOn = jest
      .spyOn(process.stdout, 'on')
      .mockImplementation((() => process.stdout) as any);
    (t as any).applyFilterAndSort = jest.fn();
    (t as any).render = jest.fn();
    t.start();
    expect(stdinOn).toHaveBeenCalledWith('keypress', expect.any(Function));
    expect(stdoutOn).toHaveBeenCalledWith('resize', expect.any(Function));
    stdinOn.mockRestore();
    stdoutOn.mockRestore();
  });

  test('stop() calls setRawMode(false) when stdin is TTY', () => {
    Object.defineProperty(process.stdin, 'isTTY', { value: true, configurable: true });
    const setRawMode = jest.fn();
    (process.stdin as any).setRawMode = setRawMode;
    const onExit = jest.fn();
    const t = new InteractiveTable(buildTable(), { onExit });
    t.stop();
    expect(setRawMode).toHaveBeenCalledWith(false);
    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
  });
});
