export declare enum IntermediateTokenType {
    startBlockComments = "startBlockComments",
    endBlockComments = "endBlockComments",
    startLineComments = "startLineComments",
    stringDelim = "stringDelim"
}
export declare enum FinalTokenType {
    whitespace = "whitespace",
    newLines = "newLines",
    lineNumbers = "lineNumbers",
    identifiers = "identifiers",
    regular = "regular",
    strings = "strings",
    regexes = "regexes",
    numbers = "numbers",
    comments = "comments",
    keywords = "keywords",
    operators = "operators",
    functions = "functions",
    members = "members",
    error = "error"
}
export declare type TokenType = IntermediateTokenType | FinalTokenType;
export declare function isFinalTokenType(token: TokenType): token is FinalTokenType;
export interface IToken {
    length: number;
    type: TokenType;
    value: string;
}
export declare class Token implements IToken {
    value: string;
    type: TokenType;
    startStringIndex: number;
    length: number;
    constructor(value: string, type: TokenType, startStringIndex?: number);
    clone(): Token;
    splitAt(i: number): Token;
    toString(): string;
}
