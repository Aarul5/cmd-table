import { TestResultTable } from '@cmd-table/reporter-core';
import type { ReporterOptions, SuiteResult, TestResult } from '@cmd-table/reporter-core';

interface VitestTaskState {
  state?: 'pass' | 'fail' | 'skip' | 'todo' | 'run';
  duration?: number;
  errors?: Array<{ message: string }>;
}

interface VitestTask {
  name: string;
  type: 'suite' | 'test' | 'custom';
  tasks?: VitestTask[];
  result?: VitestTaskState;
  file?: VitestFile;
}

interface VitestFile extends VitestTask {
  type: 'suite';
  filepath: string;
}

export class CmdTableVitestReporter {
  private options: ReporterOptions;

  constructor(options: ReporterOptions = {}) {
    this.options = options;
  }

  onFinished(files: VitestFile[] = []): void {
    const suites = this.extractSuites(files);
    const tests = this.extractTests(files);
    const renderer = new TestResultTable(this.options);

    process.stdout.write('\n');

    const summaryTable = renderer.buildSummaryTable(suites);
    process.stdout.write(summaryTable.render() + '\n');

    if (this.options.verbose) {
      process.stdout.write('\n');
      const verboseTable = renderer.buildVerboseTable(tests);
      process.stdout.write(verboseTable.render() + '\n');
    }

    if (this.options.showSlowest && this.options.showSlowest > 0) {
      process.stdout.write('\n');
      const slowestTable = renderer.buildSlowestTable(tests, this.options.showSlowest);
      process.stdout.write(slowestTable.render() + '\n');
    }

    const totalPassed = tests.filter((t) => t.status === 'passed').length;
    const totalFailed = tests.filter((t) => t.status === 'failed').length;
    const totalSkipped = tests.filter((t) => t.status === 'skipped').length;
    const status = totalFailed > 0 ? '❌ FAILED' : '✅ PASSED';
    process.stdout.write(
      `\n${status} — ${totalPassed} passed, ${totalFailed} failed, ${totalSkipped} skipped\n\n`,
    );
  }

  onWatcherRerun(): void {
    process.stdout.write('\n--- Re-running tests ---\n\n');
  }

  private extractSuites(files: VitestFile[]): SuiteResult[] {
    return files.map((file) => {
      const tests = this.flattenTests(file);
      return {
        name: file.filepath.split(/[\\/]/).pop() ?? file.filepath,
        passed: tests.filter((t) => t.result?.state === 'pass').length,
        failed: tests.filter((t) => t.result?.state === 'fail').length,
        skipped: tests.filter((t) => t.result?.state === 'skip' || t.result?.state === 'todo')
          .length,
        durationMs: tests.reduce((sum, t) => sum + (t.result?.duration ?? 0), 0),
      };
    });
  }

  private extractTests(files: VitestFile[]): TestResult[] {
    const out: TestResult[] = [];
    for (const file of files) {
      const suiteName = file.filepath.split(/[\\/]/).pop() ?? file.filepath;
      for (const task of this.flattenTests(file)) {
        const state = task.result?.state;
        const status: 'passed' | 'failed' | 'skipped' =
          state === 'pass' ? 'passed' : state === 'fail' ? 'failed' : 'skipped';
        out.push({
          suiteName,
          testName: task.name,
          status,
          durationMs: task.result?.duration ?? 0,
          errorMessage: task.result?.errors?.[0]?.message,
        });
      }
    }
    return out;
  }

  private flattenTests(task: VitestTask): VitestTask[] {
    if (task.type === 'test' || task.type === 'custom') return [task];
    return (task.tasks ?? []).flatMap((t) => this.flattenTests(t));
  }
}
