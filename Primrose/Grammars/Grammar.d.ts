import { Theme } from "../themes";
import { Token, TokenType } from "./Token";
export declare class Grammar {
    readonly name: string;
    private grammar;
    constructor(name: string, rules: Array<[TokenType, RegExp]>);
    tokenize(text: string): Token[];
    toHTML(parent: HTMLElement, txt: string, theme: Theme, fontSize: number): void;
}
