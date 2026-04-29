export interface SuiteResult {
  name: string;
  passed: number;
  failed: number;
  skipped: number;
  durationMs: number;
}

export interface TestResult {
  suiteName: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  durationMs: number;
  errorMessage?: string;
}

export interface ReporterOptions {
  theme?: string;
  verbose?: boolean;
  showSlowest?: number;
  failOnly?: boolean;
}
