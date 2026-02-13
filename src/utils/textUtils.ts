// Regex to strip ANSI escape codes
// Source: https://github.com/chalk/ansi-regex/blob/main/index.js
const ANSI_REGEX = new RegExp([
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
].join('|'), 'g');

export function stripAnsi(str: string): string {
    return str.replace(ANSI_REGEX, '');
}

export function isFullWidth(codePoint: number): boolean {
    // Code points are derived from http://www.unicode.org/Public/UNIDATA/EastAsianWidth.txt
    if (
        codePoint >= 0x1100 &&
        (
            codePoint <= 0x115f ||  // Hangul Jamo
            codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
            codePoint === 0x232a || // RIGHT-POINTING ANGLE BRACKET
            // CJK Radicals Supplement .. Enclosed CJK Letters and Months
            (0x2e80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303f) ||
            // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
            (0x3250 <= codePoint && codePoint <= 0x4dbf) ||
            // CJK Unified Ideographs .. Yi Radicals
            (0x4e00 <= codePoint && codePoint <= 0xa4c6) ||
            // Hangul Jamo Extended-A
            (0xa960 <= codePoint && codePoint <= 0xa97c) ||
            // Hangul Syllables
            (0xac00 <= codePoint && codePoint <= 0xd7a3) ||
            // CJK Compatibility Ideographs
            (0xf900 <= codePoint && codePoint <= 0xfaff) ||
            // Vertical Forms
            (0xfe10 <= codePoint && codePoint <= 0xfe19) ||
            // CJK Compatibility Forms .. Small Form Variants
            (0xfe30 <= codePoint && codePoint <= 0xfe6b) ||
            // Halfwidth and Fullwidth Forms
            (0xff01 <= codePoint && codePoint <= 0xff60) ||
            (0xffe0 <= codePoint && codePoint <= 0xffe6) ||
            // Kana Supplement
            (0x1b000 <= codePoint && codePoint <= 0x1b001) ||
            // Enclosed Ideographic Supplement
            (0x1f200 <= codePoint && codePoint <= 0x1f251) ||
            // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
            (0x20000 <= codePoint && codePoint <= 0x3fffd)
        )
    ) {
        return true;
    }
    return false;
}

export function stringWidth(str: string): number {
    const stripped = stripAnsi(str);
    let width = 0;
    for (let i = 0; i < stripped.length; i++) {
        const code = stripped.codePointAt(i);
        if (!code) continue;

        // Ignore control characters
        // ... simplified ... 

        if (isFullWidth(code)) {
            width += 2;
        } else {
            width += 1;
        }

        // Handle surrogate pairs by skipping next char if we processed a high surrogate
        if (code > 0xffff) {
            i++;
        }
    }
    return width;
}
