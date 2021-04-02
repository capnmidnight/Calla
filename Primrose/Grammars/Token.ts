// A chunk of text that represents a single element of code,

export enum IntermediateTokenType {
    startBlockComments = "startBlockComments",
    endBlockComments = "endBlockComments",
    startLineComments = "startLineComments",
    stringDelim = "stringDelim"
}

export enum FinalTokenType {
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

export type TokenType = IntermediateTokenType | FinalTokenType;

export function isFinalTokenType(token: TokenType): token is FinalTokenType {
    return Object.values(FinalTokenType)
        .indexOf(token as FinalTokenType) > -1;
}

export interface IToken {
    length: number;
    type: TokenType;
    value: string;
}

// with fields linking it back to its source.
export class Token implements IToken {
    constructor(public value: string,
        public type: TokenType,
        public startStringIndex: number = 0) {
        Object.seal(this);
    }

    get length() {
        return this.value.length;
    }

    get endStringIndex() {
        return this.startStringIndex + this.length;
    }

    clone() {
        return new Token(this.value, this.type, this.startStringIndex);
    }

    splitAt(i: number) {
        var next = this.value.substring(i);
        this.value = this.value.substring(0, i);
        return new Token(next, this.type, this.startStringIndex + i);
    }

    toString() {
        return `[${this.type}: ${this.value}]`;
    }
};
