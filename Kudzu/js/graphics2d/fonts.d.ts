import type { progressCallback } from "../io/progressCallback";
export interface FontDescription {
    fontSize: number;
    fontFamily: string;
    fontStyle?: string;
    fontVariant?: string;
    fontWeight?: string;
}
export declare function makeFont(style: FontDescription): string;
export declare function loadFont(font: string, testString?: string | null, onProgress?: progressCallback): Promise<void>;
