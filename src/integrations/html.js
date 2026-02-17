"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlTable = void 0;
var Table_1 = require("../Table");
/**
 * HTML Scraper Integration
 *
 * Parses HTML strings to extract table data.
 * Uses regex for zero-dependency implementation.
 * Note: Valid for well-formed tables; might struggle with nested tables or complex markup.
 */
var HtmlTable = /** @class */ (function () {
    function HtmlTable() {
    }
    /**
     * Create a Table from an HTML string
     * @param html String containing a <table>...</table>
     * @param options Configuration
     */
    HtmlTable.from = function (html, options) {
        if (options === void 0) { options = {}; }
        // extract table content
        var tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
        if (!tableMatch) {
            throw new Error('No <table> tag found in HTML');
        }
        var content = tableMatch[1];
        // Extract Headers
        var headerMatch = content.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
        var headerContent = headerMatch ? headerMatch[1] : content; // Fallback to content if no thead
        var headers = [];
        var thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
        var thMatch;
        while ((thMatch = thRegex.exec(headerContent)) !== null) {
            headers.push(HtmlTable.stripTags(thMatch[1]));
        }
        if (headers.length === 0) {
            // Try parsing first tr as header if no <th> found
            var trMatch = content.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
            if (trMatch) {
                var tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
                while ((thMatch = tdRegex.exec(trMatch[1])) !== null) {
                    headers.push(HtmlTable.stripTags(thMatch[1]));
                }
            }
        }
        // Initialize Table
        var table = new Table_1.Table({
            columns: headers.map(function (h) { return ({ name: h }); }),
            compact: options.compact
        });
        // Extract Rows
        // Find <tbody> content or just use table content
        var bodyMatch = content.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
        var bodyContent = bodyMatch ? bodyMatch[1] : content;
        var trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        var tr;
        while ((tr = trRegex.exec(bodyContent)) !== null) {
            var rowContent = tr[1];
            // Skip if this row (tr) looks like it was the header we parsed
            // Only relevant if we are parsing the whole content (no tbody found)
            if (bodyContent === content && headerMatch && headerMatch.index !== undefined && tr.index < headerMatch.index + headerMatch[0].length)
                continue;
            var cells = {};
            var tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
            var td = void 0;
            var i = 0;
            var hasData = false;
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
    };
    /**
     * Helper to remove HTML tags
     */
    HtmlTable.stripTags = function (html) {
        return html.replace(/<\/?[^>]+(>|$)/g, "").trim();
    };
    /**
     * Convert a Table to an HTML string
     */
    HtmlTable.toHtml = function (table) {
        // We can reuse the internal renderer or implement custom logic here
        // For now, let's reuse the Table's export functionality which uses HtmlRenderer
        return table.export('html');
    };
    return HtmlTable;
}());
exports.HtmlTable = HtmlTable;
