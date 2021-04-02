const DEFAULT_TEST_TEXT = "The quick brown fox jumps over the lazy dog";
const loadedFonts = [];
export function makeFont(style) {
    const fontParts = [];
    if (style.fontStyle && style.fontStyle !== "normal") {
        fontParts.push(style.fontStyle);
    }
    if (style.fontVariant && style.fontVariant !== "normal") {
        fontParts.push(style.fontVariant);
    }
    if (style.fontWeight && style.fontWeight !== "normal") {
        fontParts.push(style.fontWeight);
    }
    fontParts.push(style.fontSize + "px");
    fontParts.push(style.fontFamily);
    const font = fontParts.join(" ");
    return font;
}
;
export async function loadFont(font, testString = null, onProgress) {
    if (loadedFonts.indexOf(font) === -1) {
        testString = testString || DEFAULT_TEST_TEXT;
        if (onProgress) {
            onProgress(0, 1, font);
        }
        const fonts = await document.fonts.load(font, testString);
        if (onProgress) {
            onProgress(1, 1, font);
        }
        if (fonts.length === 0) {
            console.warn(`Failed to load font "${font}". If this is a system font, just set the object's \`value\` property, instead of calling \`loadFontAndSetText\`.`);
        }
        else {
            loadedFonts.push(font);
        }
    }
}
//# sourceMappingURL=fonts.js.map