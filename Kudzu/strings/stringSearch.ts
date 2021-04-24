import { isNullOrUndefined } from "../typeChecks";

/**
 * Performs the Boyer-Moore fast string search algorithm
 * over Unicode graphemes, instead of individual bytes
 * like JavaScript's regular string::indexOf method.
 * @param search - the string to search
 * @param pattern - the string to find
 */
export function stringSearch(search: string, pattern: string) {
    if (isNullOrUndefined(search)) {
        throw new Error("Parameter `search` is not defined.");
    }

    if (isNullOrUndefined(pattern)) {
        throw new Error("Parameter `pattern` is not defined.");
    }

    if (search.length === 0
        || pattern.length === 0
        || pattern.length > search.length) {
        return -1;
    }

    const strChars = [...search];
    const patternChars = [...pattern];
    const end = search.length - pattern.length;
    const offsets = new Map<string, number>();
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