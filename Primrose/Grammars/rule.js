import { FinalTokenType } from "./Token";
// A single syntax matching rule, for tokenizing code.
export class Rule {
    constructor(name, test) {
        this.name = name;
        this.test = test;
        Object.freeze(this);
    }
    carveOutMatchedToken(tokens, j) {
        const token = tokens[j];
        if (token.type === FinalTokenType.regular) {
            const res = this.test.exec(token.value);
            if (!!res) {
                // Only use the last group that matches the regex, to allow for more
                // complex regexes that can match in special contexts, but not make
                // the context part of the token.
                const midx = res[res.length - 1], start = res.input.indexOf(midx), end = start + midx.length;
                if (start === 0) {
                    // the rule matches the start of the token
                    token.type = this.name;
                    if (end < token.length) {
                        // but not the end
                        const next = token.splitAt(end);
                        next.type = FinalTokenType.regular;
                        tokens.splice(j + 1, 0, next);
                    }
                }
                else {
                    // the rule matches from the middle of the token
                    const mid = token.splitAt(start);
                    if (midx.length < mid.length) {
                        // but not the end
                        const right = mid.splitAt(midx.length);
                        tokens.splice(j + 1, 0, right);
                    }
                    mid.type = this.name;
                    tokens.splice(j + 1, 0, mid);
                }
            }
        }
    }
}
;
//# sourceMappingURL=Rule.js.map