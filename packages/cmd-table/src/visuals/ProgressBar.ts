/**
 * ProgressBar — Inline terminal progress bar generator.
 *
 * Generates a Unicode block-character progress bar string suitable for
 * embedding inside cmd-table cells, typically via a column `formatter`.
 *
 * @example
 * // Basic usage — 65 out of 100
 * ProgressBar.generate(65);           // "███████▒▒▒ 65%"
 *
 * @example
 * // Custom width and characters
 * ProgressBar.generate(3, 5, { width: 5, filled: '■', empty: '□' }); // "■■■□□ 60%"
 *
 * @example
 * // Hide the percentage label
 * ProgressBar.generate(50, 100, { showPercent: false }); // "█████▒▒▒▒▒"
 *
 * @example
 * // Use as a column formatter
 * table.addColumn({
 *   name: 'Coverage',
 *   key: 'coverage',
 *   align: 'right',
 *   formatter: (v) => ProgressBar.generate(Number(v), 100, { width: 12 }),
 * });
 */

export interface ProgressBarOptions {
  /** Width of the bar in characters (default: 10) */
  width?: number;
  /** Character used for the filled portion (default: '█') */
  filled?: string;
  /** Character used for the empty portion (default: '▒') */
  empty?: string;
  /** Whether to append the percentage label, e.g. " 65%" (default: true) */
  showPercent?: boolean;
  /** Optional label to show instead of the auto-computed percentage, e.g. "3/5" */
  label?: string;
}

export class ProgressBar {
  /**
   * Generate a progress bar string.
   *
   * @param value   - Current value (numerator).
   * @param max     - Maximum value (denominator). Defaults to 100.
   * @param options - Display options.
   * @returns A string like `"███████▒▒▒ 65%"` ready to place in a cell.
   */
  public static generate(
    value: number,
    max: number = 100,
    options: ProgressBarOptions = {},
  ): string {
    const width = options.width ?? 10;
    const filled = options.filled ?? '█';
    const empty = options.empty ?? '▒';
    const showPercent = options.showPercent ?? true;

    // Guard: avoid division by zero
    const safeMax = max === 0 ? 1 : max;

    // Clamp to [0, max]
    const clamped = Math.max(0, Math.min(safeMax, value));
    const ratio = clamped / safeMax;

    const filledCount = Math.round(ratio * width);
    const emptyCount = width - filledCount;

    const bar = filled.repeat(filledCount) + empty.repeat(emptyCount);

    if (!showPercent) return bar;

    const label = options.label ?? `${Math.round(ratio * 100)}%`;
    return `${bar} ${label}`;
  }
}
