import type { IToken } from "./Grammars/Token";
export interface IRow {
    stringLength: number;
    tokens: IToken[];
    leftCorrections: number[];
    rightCorrections: number[];
    text: string;
}
export declare class Row implements IRow {
    text: string;
    tokens: IToken[];
    startStringIndex: number;
    startTokenIndex: number;
    lineNumber: number;
    leftCorrections: number[];
    rightCorrections: number[];
    constructor(text: string, tokens: IToken[], startStringIndex: number, startTokenIndex: number, lineNumber: number);
    toString(): string;
    substring(x: number, y?: number): string;
    get stringLength(): number;
    get endStringIndex(): number;
    get numTokens(): number;
    get endTokenIndex(): number;
    static emptyRow(startStringIndex: number, startTokenIndex: number, lineNumber: number): Row;
}
