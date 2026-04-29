import { CmdTableVitestReporter } from '../src/CmdTableVitestReporter';

function makeFile(
  filepath: string,
  tests: Array<{ name: string; state: 'pass' | 'fail' | 'skip'; duration: number }>,
) {
  return {
    name: filepath,
    type: 'suite' as const,
    filepath,
    result: { state: 'pass' as const },
    tasks: tests.map((t) => ({
      name: t.name,
      type: 'test' as const,
      result: {
        state: t.state,
        duration: t.duration,
        errors: t.state === 'fail' ? [{ message: 'Expected true to be false' }] : [],
      },
    })),
  };
}

const files = [
  makeFile('/project/tests/auth.test.ts', [
    { name: 'login works', state: 'pass', duration: 120 },
    { name: 'logout works', state: 'skip', duration: 0 },
  ]),
  makeFile('/project/tests/api.test.ts', [
    { name: 'GET /users', state: 'pass', duration: 350 },
    { name: 'POST /users', state: 'fail', duration: 200 },
  ]),
];

describe('CmdTableVitestReporter', () => {
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

  it('renders summary table on finish', () => {
    new CmdTableVitestReporter().onFinished(files);
    expect(output).toContain('auth.test.ts');
    expect(output).toContain('api.test.ts');
  });

  it('shows FAILED when there are failures', () => {
    new CmdTableVitestReporter().onFinished(files);
    expect(output).toContain('❌ FAILED');
  });

  it('shows PASSED when all pass', () => {
    const passingFiles = [
      makeFile('/project/tests/utils.test.ts', [{ name: 'works', state: 'pass', duration: 50 }]),
    ];
    new CmdTableVitestReporter().onFinished(passingFiles);
    expect(output).toContain('✅ PASSED');
  });

  it('handles empty files array', () => {
    expect(() => new CmdTableVitestReporter().onFinished([])).not.toThrow();
  });

  it('renders verbose table when verbose: true', () => {
    new CmdTableVitestReporter({ verbose: true }).onFinished(files);
    expect(output).toContain('login works');
  });

  it('does not render verbose table by default', () => {
    new CmdTableVitestReporter().onFinished(files);
    expect(output).not.toContain('login works');
  });

  it('renders slowest tests when showSlowest is set', () => {
    new CmdTableVitestReporter({ showSlowest: 2 }).onFinished(files);
    expect(output).toContain('GET /users');
  });

  it('outputs watch mode message on watcher rerun', () => {
    new CmdTableVitestReporter().onWatcherRerun();
    expect(output).toContain('Re-running tests');
  });
});
