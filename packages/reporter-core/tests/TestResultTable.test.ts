import { TestResultTable } from '../src/TestResultTable';
import type { SuiteResult, TestResult } from '../src/types';

const suites: SuiteResult[] = [
  { name: 'Auth', passed: 10, failed: 0, skipped: 1, durationMs: 320 },
  { name: 'API', passed: 5, failed: 2, skipped: 0, durationMs: 850 },
];

const tests: TestResult[] = [
  { suiteName: 'Auth', testName: 'login works', status: 'passed', durationMs: 100 },
  { suiteName: 'Auth', testName: 'logout works', status: 'skipped', durationMs: 0 },
  { suiteName: 'API', testName: 'GET /users', status: 'failed', durationMs: 500 },
  { suiteName: 'API', testName: 'POST /users', status: 'failed', durationMs: 350 },
  { suiteName: 'API', testName: 'DELETE /users', status: 'passed', durationMs: 50 },
];

describe('buildSummaryTable', () => {
  it('returns one row per suite', () => {
    const table = new TestResultTable().buildSummaryTable(suites);
    expect(table.rows.length).toBe(2);
  });
  it('renders without throwing', () => {
    const table = new TestResultTable().buildSummaryTable(suites);
    expect(() => table.render()).not.toThrow();
  });
});

describe('buildVerboseTable', () => {
  it('includes all tests by default', () => {
    const table = new TestResultTable().buildVerboseTable(tests);
    expect(table.rows.length).toBe(5);
  });
  it('filters to failed only when failOnly is set', () => {
    const table = new TestResultTable({ failOnly: true }).buildVerboseTable(tests);
    expect(table.rows.length).toBe(2);
  });
});

describe('buildSlowestTable', () => {
  it('returns top N slowest tests', () => {
    const table = new TestResultTable().buildSlowestTable(tests, 3);
    expect(table.rows.length).toBe(3);
  });
  it('first row is the slowest test', () => {
    const table = new TestResultTable().buildSlowestTable(tests, 1);
    expect(table.rows[0].cells[0].content).toBe('GET /users');
  });
});
