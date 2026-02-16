/**
 * Heatmap Utility
 * Colors values based on their magnitude relative to a range.
 */
export class Heatmap {

    // ANSI Colors
    private static readonly RED = '\x1b[31m';
    private static readonly GREEN = '\x1b[32m';
    private static readonly YELLOW = '\x1b[33m';
    private static readonly BLUE = '\x1b[34m';
    private static readonly RESET = '\x1b[0m';
    private static readonly BG_RED = '\x1b[41m';
    private static readonly BG_GREEN = '\x1b[42m';

    /**
     * Apply color to a value based on a range.
     * @param value The value to color
     * @param min Minimum expected value
     * @param max Maximum expected value
     * @param type 'text' or 'bg' (background)
     */
    public static color(value: number, min: number, max: number, type: 'text' | 'bg' = 'text'): string {
        const range = max - min;
        const normalized = range === 0 ? 0.5 : (value - min) / range;

        // Simple 3-step gradient: Red -> Yellow -> Green (or reverse depending on semantics)
        // Let's assume High = Green, Low = Red for simplicity (like profit)
        // If user wants otherwise, they can swap min/max in calling code or we add options.

        // For now, let's implement a simple Red-Yellow-Green scale
        // Low (0.0 - 0.33): Red
        // Mid (0.33 - 0.66): Yellow
        // High (0.66 - 1.0): Green

        let color = '';
        if (type === 'text') {
            if (normalized < 0.33) color = Heatmap.RED;
            else if (normalized < 0.66) color = Heatmap.YELLOW;
            else color = Heatmap.GREEN;
        } else {
            // Backgrounds often just Red/Green for heat
            if (normalized < 0.5) color = Heatmap.BG_RED;
            else color = Heatmap.BG_GREEN;
        }

        return `${color}${value}${Heatmap.RESET}`;
    }

    /**
     * Auto-color an array of numbers.
     */
    public static autoColor(values: number[]): string[] {
        const min = Math.min(...values);
        const max = Math.max(...values);
        return values.map(v => Heatmap.color(v, min, max));
    }
}
