/**
 * AsyncInteractiveTable tests.
 *
 * Strategy: same as InteractiveTable — stub TTY/console, drive private state
 * directly. The async data source is mocked via a hand-rolled fake.
 */

import { Table } from '../src/Table';
import { AsyncInteractiveTable } from '../src/AsyncInteractiveTable';
import type { IDataSource } from '../src/IDataSource';

beforeAll(() => {
  Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
  jest.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new Error(`process.exit(${code ?? 0}) called`);
  }) as never);
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(process.stdout, 'write').mockImplementation((() => true) as any);
});

afterAll(() => {
  jest.restoreAllMocks();
});

const dataset = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `user-${i + 1}`,
}));

class FakeDataSource implements IDataSource {
  public lastFilter: string | undefined;
  private filtered: typeof dataset = dataset;

  async count(): Promise<number> {
    return this.filtered.length;
  }

  async getRows(offset: number, limit: number): Promise<any[]> {
    return this.filtered.slice(offset, offset + limit);
  }

  filter(query: string): void {
    this.lastFilter = query;
    this.filtered = query ? dataset.filter((r) => r.name.includes(query)) : dataset;
  }
}

const buildTemplate = () => {
  const t = new Table();
  t.addColumn({ name: 'ID', key: 'id' });
  t.addColumn({ name: 'Name', key: 'name' });
  return t;
};

describe('AsyncInteractiveTable — constructor & defaults', () => {
  test('uses default pageSize of 10', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    expect((t as any).pageSize).toBe(10);
  });

  test('honors custom pageSize', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate(), {
      pageSize: 5,
    });
    expect((t as any).pageSize).toBe(5);
  });

  test('starts in nav mode on page 1', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    expect((t as any).mode).toBe('nav');
    expect((t as any).currentPage).toBe(1);
  });
});

describe('AsyncInteractiveTable — refreshData', () => {
  test('loads rows from the data source', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    await (t as any).refreshData();
    expect((t as any).totalRows).toBe(25);
    expect((t as any).currentRows).toHaveLength(5);
    expect((t as any).currentRows[0].id).toBe(1);
  });

  test('clears isLoading once finished', async () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    await (t as any).refreshData();
    expect((t as any).isLoading).toBe(false);
  });

  test('handles data source errors gracefully', async () => {
    const broken: IDataSource = {
      count: jest.fn().mockRejectedValue(new Error('boom')),
      getRows: jest.fn().mockRejectedValue(new Error('boom')),
    };
    const t = new AsyncInteractiveTable(broken, buildTemplate());
    await (t as any).refreshData();
    expect((t as any).isLoading).toBe(false);
    // No throw, error is swallowed and logged
  });
});

describe('AsyncInteractiveTable — pagination', () => {
  test('nextPage advances and refetches', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    await (t as any).refreshData();
    (t as any).nextPage();
    // nextPage is fire-and-forget — wait for the refresh to settle.
    await new Promise((r) => setImmediate(r));
    expect((t as any).currentPage).toBe(2);
  });

  test('nextPage clamps at the last page', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    await (t as any).refreshData();
    (t as any).currentPage = 5; // last page (25 rows / 5 = 5)
    (t as any).nextPage();
    await new Promise((r) => setImmediate(r));
    expect((t as any).currentPage).toBe(5);
  });

  test('prevPage decrements within bounds', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    await (t as any).refreshData();
    (t as any).currentPage = 3;
    (t as any).prevPage();
    await new Promise((r) => setImmediate(r));
    expect((t as any).currentPage).toBe(2);
  });

  test('prevPage clamps at page 1', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    await (t as any).refreshData();
    (t as any).prevPage();
    await new Promise((r) => setImmediate(r));
    expect((t as any).currentPage).toBe(1);
  });
});

describe('AsyncInteractiveTable — keypress routing', () => {
  test('Ctrl+C calls stop', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    const stop = jest.spyOn(t, 'stop').mockImplementation(() => {});
    (t as any).handleKey('', { name: 'c', ctrl: true });
    expect(stop).toHaveBeenCalled();
  });

  test('"q" in nav mode calls stop', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    const stop = jest.spyOn(t, 'stop').mockImplementation(() => {});
    (t as any).handleKey('q', { name: 'q' });
    expect(stop).toHaveBeenCalled();
  });

  test('"/" enters filter mode', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    (t as any).handleKey('/', { name: 'slash' });
    expect((t as any).mode).toBe('filter');
    expect((t as any).filterQuery).toBe('');
  });

  test('input is ignored while loading', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    const stop = jest.spyOn(t, 'stop').mockImplementation(() => {});
    (t as any).isLoading = true;
    (t as any).handleKey('q', { name: 'q' });
    expect(stop).not.toHaveBeenCalled();
  });

  test('right-arrow advances pages', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    await (t as any).refreshData();
    (t as any).handleKey('', { name: 'right' });
    await new Promise((r) => setImmediate(r));
    expect((t as any).currentPage).toBe(2);
  });

  test('"n" advances pages', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    await (t as any).refreshData();
    (t as any).handleKey('n', { name: 'n' });
    await new Promise((r) => setImmediate(r));
    expect((t as any).currentPage).toBe(2);
  });

  test('"p" goes back', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    await (t as any).refreshData();
    (t as any).currentPage = 3;
    (t as any).handleKey('p', { name: 'p' });
    await new Promise((r) => setImmediate(r));
    expect((t as any).currentPage).toBe(2);
  });

  test('enter calls stop in nav mode', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    const stop = jest.spyOn(t, 'stop').mockImplementation(() => {});
    (t as any).handleKey('', { name: 'enter' });
    expect(stop).toHaveBeenCalled();
  });
});

describe('AsyncInteractiveTable — filter mode', () => {
  test('typing characters appends to filterQuery', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    (t as any).mode = 'filter';
    (t as any).handleKey('u', { name: 'u' });
    (t as any).handleKey('s', { name: 's' });
    expect((t as any).filterQuery).toBe('us');
  });

  test('backspace removes the last character', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    (t as any).mode = 'filter';
    (t as any).filterQuery = 'use';
    (t as any).handleKey('', { name: 'backspace' });
    expect((t as any).filterQuery).toBe('us');
  });

  test('enter applies the filter via dataSource.filter()', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate(), { pageSize: 5 });
    (t as any).mode = 'filter';
    (t as any).filterQuery = 'user-1';
    (t as any).handleKey('', { name: 'enter' });
    await new Promise((r) => setImmediate(r));
    expect(ds.lastFilter).toBe('user-1');
    expect((t as any).mode).toBe('nav');
  });

  test('escape clears the filter and exits to nav mode', async () => {
    const ds = new FakeDataSource();
    const t = new AsyncInteractiveTable(ds, buildTemplate());
    (t as any).mode = 'filter';
    (t as any).filterQuery = 'something';
    (t as any).handleKey('', { name: 'escape' });
    await new Promise((r) => setImmediate(r));
    expect((t as any).mode).toBe('nav');
    expect((t as any).filterQuery).toBe('');
    expect(ds.lastFilter).toBe('');
  });

  test('enter on a data source without filter() just exits the mode', async () => {
    const ds: IDataSource = {
      count: async () => 0,
      getRows: async () => [],
    };
    const t = new AsyncInteractiveTable(ds, buildTemplate());
    (t as any).mode = 'filter';
    (t as any).filterQuery = 'x';
    (t as any).handleKey('', { name: 'enter' });
    expect((t as any).mode).toBe('nav');
  });

  test('control chars do not pollute the query', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    (t as any).mode = 'filter';
    (t as any).handleKey('a', { name: 'a', ctrl: true });
    expect((t as any).filterQuery).toBe('');
  });
});

describe('AsyncInteractiveTable — render does not throw', () => {
  test('render draws current page', async () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate(), {
      pageSize: 5,
    });
    await (t as any).refreshData();
    expect(() => (t as any).render()).not.toThrow();
  });

  test('render shows loading state', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    (t as any).isLoading = true;
    expect(() => (t as any).render()).not.toThrow();
  });
});

describe('AsyncInteractiveTable — stop()', () => {
  test('invokes onExit callback when provided', () => {
    const onExit = jest.fn();
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate(), {
      onExit,
    });
    t.stop();
    expect(onExit).toHaveBeenCalled();
  });

  test('falls back to process.exit when no onExit provided', () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate());
    expect(() => t.stop()).toThrow(/process\.exit/);
  });
});

describe('AsyncInteractiveTable — start() and stop() TTY branch', () => {
  test('start() registers keypress listener on stdin', async () => {
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate(), { pageSize: 5 });
    const stdinOn = jest
      .spyOn(process.stdin, 'on')
      .mockImplementation((() => process.stdin) as any);
    const stdoutOn = jest
      .spyOn(process.stdout, 'on')
      .mockImplementation((() => process.stdout) as any);
    (t as any).refreshData = jest.fn().mockResolvedValue(undefined);
    (t as any).render = jest.fn();
    await t.start();
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
    const t = new AsyncInteractiveTable(new FakeDataSource(), buildTemplate(), { onExit });
    t.stop();
    expect(setRawMode).toHaveBeenCalledWith(false);
    Object.defineProperty(process.stdin, 'isTTY', { value: false, configurable: true });
  });
});
