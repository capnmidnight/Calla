const DEFAULT_TEST_TEXT = "The quick brown fox jumps over the lazy dog";
const loadedFonts = [];

/**
 * @param {string} font
 * @param {string?} testString
 */
export async function loadFont(font, testString = DEFAULT_TEST_TEXT) {
    if (loadedFonts.indexOf(font) === -1) {
        const fonts = await document.fonts.load(font, testString);
        if (fonts.length === 0) {
            console.warn(`Failed to load font "${font}". If this is a system font, just set the object's \`value\` property, instead of calling \`loadFontAndSetText\`.`);
        }
        else {
            loadedFonts.push(font);
        }
    }
}