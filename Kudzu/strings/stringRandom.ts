import { isNullOrUndefined } from "../typeChecks";

const DEFAULT_CHAR_SET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";

export function stringRandom(length: number, charSet?: string): string {
    if (length < 0) {
        throw new Error("Length must be greater than 0");
    }

    if (isNullOrUndefined(charSet)) {
        charSet = DEFAULT_CHAR_SET;
    }

    let str = "";
    for (let i = 0; i < length; ++i) {
        const idx = Math.floor(Math.random() * charSet.length);
        str += charSet[idx];
    }

    return str;
}