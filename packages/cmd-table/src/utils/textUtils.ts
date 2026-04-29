// Regex to strip ANSI escape codes
// Source: https://github.com/chalk/ansi-regex/blob/main/index.js
const ANSI_REGEX = new RegExp(
  [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
  ].join('|'),
  'g',
);

export function stripAnsi(str: string): string {
  return str.replace(ANSI_REGEX, '');
}

export function isEmoji(cp: number): boolean {
  return (
    (0x1f600 <= cp && cp <= 0x1f64f) || // Emoticons
    (0x1f300 <= cp && cp <= 0x1f5ff) || // Misc Symbols & Pictographs
    (0x1f680 <= cp && cp <= 0x1f6ff) || // Transport & Map
    (0x1f900 <= cp && cp <= 0x1f9ff) || // Supplemental Symbols & Pictographs
    (0x1fa00 <= cp && cp <= 0x1fa6f) || // Chess Symbols
    (0x1fa70 <= cp && cp <= 0x1faff) || // Symbols & Pictographs Extended-A
    (0x1f004 === cp) ||                  // Mahjong Red Dragon
    (0x1f0cf === cp) ||                  // Playing Card Black Joker
    (0x1f170 <= cp && cp <= 0x1f171) || // Neg Squared A/B
    (0x1f17e <= cp && cp <= 0x1f17f) || // Neg Squared O/P
    (0x1f18e === cp) ||                  // Neg Squared AB
    (0x1f191 <= cp && cp <= 0x1f19a) || // Squared CL..VS
    (0x1f1e0 <= cp && cp <= 0x1f1ff) || // Regional Indicators (flags)
    (0x231a <= cp && cp <= 0x231b) ||   // Watch, Hourglass
    (0x23e9 <= cp && cp <= 0x23f3) ||   // Media symbols
    (0x23f8 <= cp && cp <= 0x23fa) ||   // Pause, Record
    (0x25aa <= cp && cp <= 0x25ab) ||   // Small squares
    cp === 0x25b6 ||                     // Play button
    cp === 0x25c0 ||                     // Reverse play
    (0x25fb <= cp && cp <= 0x25fe) ||   // Medium squares
    (0x2600 <= cp && cp <= 0x26ff) ||   // Misc Symbols
    (0x2700 <= cp && cp <= 0x27bf) ||   // Dingbats
    (0x2934 <= cp && cp <= 0x2935) ||   // Arrows
    (0x2b05 <= cp && cp <= 0x2b07) ||   // Arrows
    (0x2b1b <= cp && cp <= 0x2b1c) ||   // Large squares
    cp === 0x2b50 ||                     // Star
    cp === 0x2b55 ||                     // Circle
    cp === 0x3030 ||                     // Wavy dash
    cp === 0x303d ||                     // Part alternation mark
    cp === 0x3297 ||                     // Circled Ideograph Congratulation
    cp === 0x3299                        // Circled Ideograph Secret
  );
}

export function isZeroWidth(cp: number): boolean {
  return (
    cp === 0x200b ||                     // Zero-width space
    cp === 0x200c ||                     // Zero-width non-joiner
    cp === 0x200d ||                     // Zero-width joiner (ZWJ)
    cp === 0x200e ||                     // Left-to-right mark
    cp === 0x200f ||                     // Right-to-left mark
    cp === 0xfeff ||                     // Zero-width no-break space (BOM)
    (0xfe00 <= cp && cp <= 0xfe0f) ||   // Variation Selectors
    (0xe0100 <= cp && cp <= 0xe01ef) || // Variation Selectors Supplement
    (0x1f3fb <= cp && cp <= 0x1f3ff) || // Skin tone modifiers
    (0x20d0 <= cp && cp <= 0x20ff) ||   // Combining Diacritical Marks for Symbols
    (0xe0020 <= cp && cp <= 0xe007f)    // Tags (flag sequences)
  );
}

export function isFullWidth(codePoint: number): boolean {
  // Code points are derived from http://www.unicode.org/Public/UNIDATA/EastAsianWidth.txt
  if (
    codePoint >= 0x1100 &&
    (codePoint <= 0x115f || // Hangul Jamo
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
      (0x20000 <= codePoint && codePoint <= 0x3fffd))
  ) {
    return true;
  }
  return false;
}

export function stringWidth(str: string): number {
  const stripped = stripAnsi(str);
  let width = 0;
  let inEmojiZwjSequence = false;

  for (let i = 0; i < stripped.length; i++) {
    const code = stripped.codePointAt(i);
    if (!code) continue;

    // Skip surrogate pair trailing unit
    if (code > 0xffff) {
      i++;
    }

    // Control characters (0x00-0x1F, 0x7F-0x9F) are zero-width
    if (code <= 0x1f || (0x7f <= code && code <= 0x9f)) {
      continue;
    }

    // Zero-width joiner: marks that the next emoji is part of the current cluster
    if (code === 0x200d) {
      inEmojiZwjSequence = true;
      continue;
    }

    // Other zero-width characters: variation selectors, skin tone modifiers, etc.
    if (isZeroWidth(code)) {
      continue;
    }

    // Emoji characters
    if (isEmoji(code)) {
      // If we're inside a ZWJ sequence, this emoji is joined to the previous one — skip its width
      if (inEmojiZwjSequence) {
        inEmojiZwjSequence = false;
        continue;
      }
      width += 2;
      continue;
    }

    // CJK and other fullwidth characters
    if (isFullWidth(code)) {
      width += 2;
    } else {
      width += 1;
    }

    inEmojiZwjSequence = false;
  }
  return width;
}
