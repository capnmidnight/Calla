/**
 * Performs the Boyer-Moore fast string search algorithm
 * over Unicode graphemes, instead of individual bytes
 * like JavaScript's regular string::indexOf method.
 * @param search
 * @param pattern
 */
export function stringSearch(search, pattern) {
    const strChars = [...search];
    const patternChars = [...pattern];
    const end = search.length - pattern.length;
    const offsets = new Map();
    for (let i = 0; i < patternChars.length; ++i) {
        const char = patternChars[patternChars.length - i - 1];
        if (!offsets.has(char)) {
            offsets.set(char, i);
        }
    }
    let start = 0;
    let index = -1;
    while (index === -1 && start <= end) {
        for (let i = patternChars.length - 1; i >= 0; --i) {
            const charA = patternChars[i];
            const charB = strChars[start + i];
            if (charA !== charB) {
                if (offsets.has(charB)) {
                    start += offsets.get(charB);
                }
                else {
                    start += patternChars.length;
                }
                break;
            }
            else if (i === 0) {
                index = start;
            }
        }
    }
    return index;
}
//# sourceMappingURL=stringSearch.js.map