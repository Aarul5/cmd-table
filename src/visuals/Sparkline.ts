/**
 * Sparkline Generator
 * Generates mini bar charts using Unicode block characters.
 */
export class Sparkline {
    private static readonly BARS = [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

    /**
     * Generate a sparkline string from an array of numbers.
     * @param values Array of numbers to chart
     * @param options Configuration options
     */
    public static generate(values: number[], options?: { min?: number, max?: number }): string {
        if (!values || values.length === 0) return '';

        let min = options?.min ?? Math.min(...values);
        let max = options?.max ?? Math.max(...values);

        // Avoid division by zero
        if (min === max) {
            max = min + 1;
        }

        const range = max - min;

        return values.map(v => {
            // Clamp value
            const val = Math.max(min, Math.min(max, v));
            // Normalize to 0-1
            const normalized = (val - min) / range;
            // Map to index (0-7)
            const index = Math.floor(normalized * (Sparkline.BARS.length - 1));
            return Sparkline.BARS[index];
        }).join('');
    }
}
