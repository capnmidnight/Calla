// A chunk of text that represents a single element of code,
export var IntermediateTokenType;
(function (IntermediateTokenType) {
    IntermediateTokenType["startBlockComments"] = "startBlockComments";
    IntermediateTokenType["endBlockComments"] = "endBlockComments";
    IntermediateTokenType["startLineComments"] = "startLineComments";
    IntermediateTokenType["stringDelim"] = "stringDelim";
})(IntermediateTokenType || (IntermediateTokenType = {}));
export var FinalTokenType;
(function (FinalTokenType) {
    FinalTokenType["whitespace"] = "whitespace";
    FinalTokenType["newLines"] = "newLines";
    FinalTokenType["lineNumbers"] = "lineNumbers";
    FinalTokenType["identifiers"] = "identifiers";
    FinalTokenType["regular"] = "regular";
    FinalTokenType["strings"] = "strings";
    FinalTokenType["regexes"] = "regexes";
    FinalTokenType["numbers"] = "numbers";
    FinalTokenType["comments"] = "comments";
    FinalTokenType["keywords"] = "keywords";
    FinalTokenType["operators"] = "operators";
    FinalTokenType["functions"] = "functions";
    FinalTokenType["members"] = "members";
    FinalTokenType["error"] = "error";
})(FinalTokenType || (FinalTokenType = {}));
export function isFinalTokenType(token) {
    return Object.values(FinalTokenType)
        .indexOf(token) > -1;
}
// with fields linking it back to its source.
export class Token {
    constructor(value, type, startStringIndex = 0) {
        this.value = value;
        this.type = type;
        this.startStringIndex = startStringIndex;
        this.length = value.length;
        Object.seal(this);
    }
    clone() {
        return new Token(this.value, this.type, this.startStringIndex);
    }
    splitAt(i) {
        var next = this.value.substring(i);
        this.value = this.value.substring(0, i);
        return new Token(next, this.type, this.startStringIndex + i);
    }
    toString() {
        return `[${this.type}: ${this.value}]`;
    }
}
;
//# sourceMappingURL=Token.js.map