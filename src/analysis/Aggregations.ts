export class Aggregations {
    public static sum(values: number[]): number {
        return values.reduce((a, b) => a + b, 0);
    }

    public static avg(values: number[]): number {
        if (values.length === 0) return 0;
        return Number((this.sum(values) / values.length).toFixed(2));
    }

    public static min(values: number[]): number {
        if (values.length === 0) return 0;
        return Math.min(...values);
    }

    public static max(values: number[]): number {
        if (values.length === 0) return 0;
        return Math.max(...values);
    }

    public static count(values: any[]): number {
        return values.length;
    }

    public static stdDev(values: number[]): number {
        if (values.length === 0) return 0;
        const mean = this.avg(values);
        const squareDiffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquareDiff = this.avg(squareDiffs);
        return Number(Math.sqrt(avgSquareDiff).toFixed(2));
    }

    public static variance(values: number[]): number {
        if (values.length === 0) return 0;
        const mean = this.avg(values);
        const squareDiffs = values.map(value => Math.pow(value - mean, 2));
        return Number(this.avg(squareDiffs).toFixed(2));
    }

    public static percentile(values: number[], p: number): number {
        if (values.length === 0) return 0;
        const sorted = [...values].sort((a, b) => a - b);
        const pos = (sorted.length - 1) * p;
        const base = Math.floor(pos);
        const rest = pos - base;
        if (sorted[base + 1] !== undefined) {
            return Number((sorted[base] + rest * (sorted[base + 1] - sorted[base])).toFixed(2));
        } else {
            return Number(sorted[base].toFixed(2));
        }
    }
}
