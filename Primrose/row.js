export class Row {
    constructor(text, tokens, startStringIndex, startTokenIndex, lineNumber) {
        this.text = text;
        this.tokens = tokens;
        this.startStringIndex = startStringIndex;
        this.startTokenIndex = startTokenIndex;
        this.lineNumber = lineNumber;
        const graphemes = Object.freeze([...this.text]);
        this.leftCorrections = new Array(this.text.length);
        this.rightCorrections = new Array(this.text.length);
        let x = 0;
        for (let grapheme of graphemes) {
            this.leftCorrections[x] = 0;
            this.rightCorrections[x] = 0;
            for (let i = 1; i < grapheme.length; ++i) {
                this.leftCorrections[x + i] = -i;
                this.rightCorrections[x + i] = grapheme.length - i;
            }
            x += grapheme.length;
        }
        Object.seal(this);
    }
    toString() {
        return this.text;
    }
    substring(x, y) {
        return this.text.substring(x, y);
    }
    get endStringIndex() {
        return this.startStringIndex + this.text.length;
    }
    get numTokens() {
        return this.tokens.length;
    }
    get endTokenIndex() {
        return this.startTokenIndex + this.numTokens;
    }
    static emptyRow(startStringIndex, startTokenIndex, lineNumber) {
        return new Row("", [], startStringIndex, startTokenIndex, lineNumber);
    }
}
//# sourceMappingURL=Row.js.map