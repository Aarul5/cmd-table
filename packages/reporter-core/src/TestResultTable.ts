import { Table } from 'cmd-table';
import type { SuiteResult, TestResult, ReporterOptions } from './types.js';
import { formatDuration, statusIcon, statusColor } from './formatters.js';

export class TestResultTable {
  private options: ReporterOptions;

  constructor(options: ReporterOptions = {}) {
    this.options = options;
  }

  buildSummaryTable(suites: SuiteResult[]): Table {
    const table = new Table();
    table.addColumn({ name: 'Suite', key: 'name' });
    table.addColumn({ name: '', key: 'status', maxWidth: 4 });
    table.addColumn({ name: 'Pass', key: 'passed', align: 'right' });
    table.addColumn({ name: 'Fail', key: 'failed', align: 'right' });
    table.addColumn({ name: 'Skip', key: 'skipped', align: 'right' });
    table.addColumn({ name: 'Duration', key: 'duration', align: 'right' });

    for (const suite of suites) {
      const overallStatus = suite.failed > 0 ? 'failed' : suite.passed > 0 ? 'passed' : 'skipped';
      table.addRow({
        name: suite.name,
        status: statusIcon(overallStatus),
        passed: String(suite.passed),
        failed: String(suite.failed),
        skipped: String(suite.skipped),
        duration: formatDuration(suite.durationMs),
      });
    }

    table.summarize(['passed', 'failed', 'skipped'], 'sum');
    return table;
  }

  buildVerboseTable(tests: TestResult[]): Table {
    const filtered = this.options.failOnly ? tests.filter((t) => t.status === 'failed') : tests;

    const table = new Table({
      rowColor: (row) => statusColor(row['status'] as 'passed' | 'failed' | 'skipped'),
    });
    table.addColumn({ name: 'Suite', key: 'suite' });
    table.addColumn({ name: 'Test', key: 'test' });
    table.addColumn({ name: 'Status', key: 'statusIcon', maxWidth: 4 });
    table.addColumn({ name: 'Duration', key: 'duration', align: 'right' });

    for (const t of filtered) {
      table.addRow({
        suite: t.suiteName,
        test: t.testName,
        status: t.status,
        statusIcon: statusIcon(t.status),
        duration: formatDuration(t.durationMs),
      });
    }

    return table;
  }

  buildSlowestTable(tests: TestResult[], count: number): Table {
    const slowest = [...tests].sort((a, b) => b.durationMs - a.durationMs).slice(0, count);

    const table = new Table();
    table.addColumn({ name: 'Slowest Tests', key: 'test' });
    table.addColumn({ name: 'Suite', key: 'suite' });
    table.addColumn({ name: 'Duration', key: 'duration', align: 'right' });

    for (const t of slowest) {
      table.addRow({
        test: t.testName,
        suite: t.suiteName,
        duration: formatDuration(t.durationMs),
      });
    }

    return table;
  }
}
