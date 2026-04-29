import { CmdTableReporter } from '../src/CmdTableReporter';

function makeResults(
  overrides: Partial<{
    numFailedTests: number;
    numPassedTests: number;
    numPendingTests: number;
  }> = {},
) {
  return {
    numFailedTestSuites: 0,
    numPassedTestSuites: 2,
    numPendingTestSuites: 0,
    numFailedTests: overrides.numFailedTests ?? 0,
    numPassedTests: overrides.numPassedTests ?? 10,
    numPendingTests: overrides.numPendingTests ?? 1,
    startTime: Date.now() - 1500,
    testResults: [
      {
        testFilePath: '/project/tests/auth.test.ts',
        numPassingTests: 8,
        numFailingTests: 0,
        numPendingTests: 1,
        perfStats: { start: Date.now() - 1500, end: Date.now() - 900 },
        testResults: [
          {
            ancestorTitles: [],
            fullName: 'login works',
            status: 'passed' as const,
            duration: 120,
            failureMessages: [],
          },
          {
            ancestorTitles: [],
            fullName: 'logout works',
            status: 'pending' as const,
            duration: null,
            failureMessages: [],
          },
        ],
      },
      {
        testFilePath: '/project/tests/api.test.ts',
        numPassingTests: 2,
        numFailingTests: overrides.numFailedTests ?? 0,
        numPendingTests: 0,
        perfStats: { start: Date.now() - 900, end: Date.now() },
        testResults: [
          {
            ancestorTitles: [],
            fullName: 'GET /users',
            status: 'passed' as const,
            duration: 350,
            failureMessages: [],
          },
          {
            ancestorTitles: [],
            fullName: 'POST /users',
            status: (overrides.numFailedTests ?? 0) > 0 ? ('failed' as const) : ('passed' as const),
            duration: 200,
            failureMessages:
              (overrides.numFailedTests ?? 0) > 0 ? ['Expected 201 but got 500'] : [],
          },
        ],
      },
    ],
  };
}

describe('CmdTableReporter', () => {
  let output: string;
  let writeSpy: jest.SpyInstance;

  beforeEach(() => {
    output = '';
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      output += chunk;
      return true;
    });
  });

  afterEach(() => {
    writeSpy.mockRestore();
  });

  it('renders a summary table on run complete', () => {
    const reporter = new CmdTableReporter({}, {});
    reporter.onRunComplete({}, makeResults());
    expect(output).toContain('auth.test.ts');
    expect(output).toContain('api.test.ts');
  });

  it('shows PASSED when no failures', () => {
    const reporter = new CmdTableReporter({}, {});
    reporter.onRunComplete({}, makeResults());
    expect(output).toContain('✅ PASSED');
  });

  it('shows FAILED when there are failures', () => {
    const reporter = new CmdTableReporter({}, {});
    reporter.onRunComplete({}, makeResults({ numFailedTests: 1 }));
    expect(output).toContain('❌ FAILED');
  });

  it('renders verbose table when verbose: true', () => {
    const reporter = new CmdTableReporter({}, { verbose: true });
    reporter.onRunComplete({}, makeResults());
    expect(output).toContain('login works');
  });

  it('does not render verbose table by default', () => {
    const reporter = new CmdTableReporter({}, {});
    reporter.onRunComplete({}, makeResults());
    expect(output).not.toContain('login works');
  });

  it('renders slowest tests when showSlowest is set', () => {
    const reporter = new CmdTableReporter({}, { showSlowest: 2 });
    reporter.onRunComplete({}, makeResults());
    expect(output).toContain('GET /users');
  });
});
