
export interface IDataSource<T = any> {
    /**
     * Get total number of rows
     */
    count(): Promise<number>;

    /**
     * Get a slice of data
     * @param offset Starting index (0-based)
     * @param limit Number of rows to return
     */
    getRows(offset: number, limit: number): Promise<T[]>;

    /**
     * Optional: Sort the data source
     */
    sort?(column: string, direction: 'asc' | 'desc'): void;

    /**
     * Optional: Filter the data source
     */
    filter?(query: string): void;
}
