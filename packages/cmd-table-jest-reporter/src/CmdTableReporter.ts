import { TestResultTable } from '@cmd-table/reporter-core';
import type { ReporterOptions, SuiteResult, TestResult } from '@cmd-table/reporter-core';

interface JestAggregatedResult {
  numFailedTestSuites: number;
  numPassedTestSuites: number;
  numPendingTestSuites: number;
  numFailedTests: number;
  numPassedTests: number;
  numPendingTests: number;
  testResults: JestTestFileResult[];
  startTime: number;
}

interface JestTestFileResult {
  testFilePath: string;
  testResults: JestAssertionResult[];
  perfStats: { start: number; end: number };
  numFailingTests: number;
  numPassingTests: number;
  numPendingTests: number;
}

interface JestAssertionResult {
  ancestorTitles: string[];
  fullName: string;
  status: 'passed' | 'failed' | 'pending' | 'skipped';
  duration?: number | null;
  failureMessages: string[];
}

export class CmdTableReporter {
  private options: ReporterOptions;

  constructor(_globalConfig: unknown, options: ReporterOptions = {}) {
    this.options = options;
  }

  onRunComplete(_testContexts: unknown, results: JestAggregatedResult): void {
    const suites = this.extractSuites(results);
    const tests = this.extractTests(results);
    const renderer = new TestResultTable(this.options);

    process.stdout.write('\n');

    // Summary table — always shown
    const summaryTable = renderer.buildSummaryTable(suites);
    process.stdout.write(summaryTable.render() + '\n');

    // Verbose table — shown if verbose: true
    if (this.options.verbose) {
      process.stdout.write('\n');
      const verboseTable = renderer.buildVerboseTable(tests);
      process.stdout.write(verboseTable.render() + '\n');
    }

    // Slowest tests — shown if showSlowest > 0
    if (this.options.showSlowest && this.options.showSlowest > 0) {
      process.stdout.write('\n');
      const slowestTable = renderer.buildSlowestTable(tests, this.options.showSlowest);
      process.stdout.write(slowestTable.render() + '\n');
    }

    // Final pass/fail line
    const totalFailed = results.numFailedTests;
    const totalPassed = results.numPassedTests;
    const totalSkipped = results.numPendingTests;
    const duration = ((Date.now() - results.startTime) / 1000).toFixed(2);
    const status = totalFailed > 0 ? '❌ FAILED' : '✅ PASSED';
    process.stdout.write(
      `\n${status} — ${totalPassed} passed, ${totalFailed} failed, ${totalSkipped} skipped in ${duration}s\n\n`,
    );
  }

  private extractSuites(results: JestAggregatedResult): SuiteResult[] {
    return results.testResults.map((fileResult) => ({
      name: fileResult.testFilePath.split(/[\\/]/).pop() ?? fileResult.testFilePath,
      passed: fileResult.numPassingTests,
      failed: fileResult.numFailingTests,
      skipped: fileResult.numPendingTests,
      durationMs: fileResult.perfStats.end - fileResult.perfStats.start,
    }));
  }

  private extractTests(results: JestAggregatedResult): TestResult[] {
    const out: TestResult[] = [];
    for (const fileResult of results.testResults) {
      const suiteName = fileResult.testFilePath.split(/[\\/]/).pop() ?? fileResult.testFilePath;
      for (const t of fileResult.testResults) {
        out.push({
          suiteName,
          testName: t.fullName,
          status:
            t.status === 'pending' ? 'skipped' : (t.status as 'passed' | 'failed' | 'skipped'),
          durationMs: t.duration ?? 0,
          errorMessage: t.failureMessages[0],
        });
      }
    }
    return out;
  }
}
