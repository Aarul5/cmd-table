import { Table } from '../Table';

/**
 * HTML Scraper Integration
 * 
 * Parses HTML strings to extract table data. 
 * Uses regex for zero-dependency implementation. 
 * Note: Valid for well-formed tables; might struggle with nested tables or complex markup.
 */
export class HtmlTable {

    /**
     * Create a Table from an HTML string
     * @param html String containing a <table>...</table>
     * @param options Configuration
     */
    public static from(html: string, options: { selector?: string, compact?: boolean } = {}): Table {
        // extract table content
        const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
        if (!tableMatch) {
            throw new Error('No <table> tag found in HTML');
        }

        const content = tableMatch[1];

        // Extract Headers
        const headerMatch = content.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
        const headerContent = headerMatch ? headerMatch[1] : content; // Fallback to content if no thead

        const headers: string[] = [];
        const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
        let thMatch;
        while ((thMatch = thRegex.exec(headerContent)) !== null) {
            headers.push(HtmlTable.stripTags(thMatch[1]));
        }

        if (headers.length === 0) {
            // Try parsing first tr as header if no <th> found
            const trMatch = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
            if (trMatch) {
                const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
                while ((thMatch = tdRegex.exec(trMatch[1])) !== null) {
                    headers.push(HtmlTable.stripTags(thMatch[1]));
                }
            }
        }

        // Initialize Table
        const table = new Table({
            columns: headers.map(h => ({ name: h })),
            compact: options.compact
        });

        // Extract Rows
        // Find <tbody> content or just use table content
        const bodyMatch = content.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : content;

        const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let tr;
        while ((tr = trRegex.exec(bodyContent)) !== null) {
            const rowContent = tr[1];
            // Skip if this row (tr) looks like it was the header we parsed
            // Only relevant if we are parsing the whole content (no tbody found)
            if (bodyContent === content && headerMatch && headerMatch.index !== undefined && tr.index < headerMatch.index + headerMatch[0].length) continue;

            const cells: any = {};
            const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
            let td;
            let i = 0;
            let hasData = false;
            while ((td = tdRegex.exec(rowContent)) !== null) {
                if (i < headers.length) {
                    cells[headers[i]] = HtmlTable.stripTags(td[1]);
                    hasData = true;
                }
                i++;
            }
            if (hasData) {
                table.addRow(cells);
            }
        }

        return table;
    }

    /**
     * Helper to remove HTML tags
     */
    private static stripTags(html: string): string {
        return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
    }
}
