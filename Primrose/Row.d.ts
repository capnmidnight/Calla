import type { Cursor } from "./Cursor";
import type { Token } from "./Grammars/Token";
export declare class Row {
    text: string;
    tokens: Token[];
    startStringIndex: number;
    startTokenIndex: number;
    lineNumber: number;
    private leftCorrections;
    private rightCorrections;
    constructor(text: string, tokens: Token[], startStringIndex: number, startTokenIndex: number, lineNumber: number);
    adjust(cursor: Cursor, dir: number): void;
    toString(): string;
    substring(x: number, y?: number): string;
    get stringLength(): number;
    get endStringIndex(): number;
    get numTokens(): number;
    get endTokenIndex(): number;
    static emptyRow(startStringIndex: number, startTokenIndex: number, lineNumber: number): Row;
}
