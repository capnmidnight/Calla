/*
pliny.class({
  parent: "Primrose.Text",
    name: "Grammar",
    parameters: [{
      name: "grammarName",
      type: "String",
      description: "A user-friendly name for the grammar, to be able to include it in an options listing."
    }, {
      name: "rules",
      type: "Array",
      description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
    }],
    description: "A Grammar is a collection of rules for processing text into tokens. Tokens are special characters that tell us about the structure of the text, things like keywords, curly braces, numbers, etc. After the text is tokenized, the tokens get a rough processing pass that groups them into larger elements that can be rendered in color on the screen.\n\
\n\
As tokens are discovered, they are removed from the text being processed, so order is important. Grammar rules are applied in the order they are specified, and more than one rule can produce the same token type.\n\
\n\
See [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names.",
    examples: [{
      name: "A plain-text \"grammar\".",
      description: "Plain text does not actually have a grammar that needs to be processed. However, to get the text to work with the rendering system, a basic grammar is necessary to be able to break the text up into lines and prepare it for rendering.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var plainTextGrammar = new Primrose.Text.Grammar(\n\
    // The name is for displaying in options views.\n\
    \"Plain-text\", [\n\
    // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
    [\"newlines\", /(?:\\r\\n|\\r|\\n)/] \n\
  ] );"
    }, {
      name: "A grammar for BASIC",
      description: "The BASIC programming language is now defunct, but a grammar for it to display in Primrose is quite easy to build.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var basicGrammar = new Primrose.Text.Grammar( \"BASIC\",\n\
    // Grammar rules are applied in the order they are specified.\n\
    [\n\
      // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
      [ \"newlines\", /(?:\\r\\n|\\r|\\n)/ ],\n\
      // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.\n\
      [ \"lineNumbers\", /^\\d+\\s+/ ],\n\
      // Comments were lines that started with the keyword \"REM\" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.\n\
      [ \"startLineComments\", /^REM\\s/ ],\n\
      // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.\n\
      [ \"strings\", /\"(?:\\\\\"|[^\"])*\"/ ],\n\
      [ \"strings\", /'(?:\\\\'|[^'])*'/ ],\n\
      // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).\n\
      [ \"numbers\", /-?(?:(?:\\b\\d*)?\\.)?\\b\\d+\\b/ ],\n\
      // Keywords are really just a list of different words we want to match, surrounded by the \"word boundary\" selector \"\\b\".\n\
      [ \"keywords\",\n\
        /\\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\\b/\n\
      ],\n\
      // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.\n\
      [ \"keywords\", /^DEF FN/ ],\n\
      // These are all treated as mathematical operations.\n\
      [ \"operators\",\n\
        /(?:\\+|;|,|-|\\*\\*|\\*|\\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\\(|\\)|\\[|\\])/\n\
      ],\n\
      // Once everything else has been matched, the left over blocks of words are treated as variable and function names.\n\
      [ \"identifiers\", /\\w+\\$?/ ]\n\
    ] );"
    }]
});
*/
import { backgroundColor, color, fontStyle, fontWeight, getMonospaceFamily, styles } from "kudzu/html/css";
import { BR, Div, Span } from "kudzu/html/tags";
import { Light as DefaultTheme, Theme } from "../themes";
import { Rule } from "./Rule";
import { FinalTokenType, IntermediateTokenType, isFinalTokenType, Token, TokenType } from "./Token";

function crudeParsing(tokens: Token[]) {
    let commentDelim: TokenType = null,
        stringDelim: string = null;
    for (let i = 0; i < tokens.length; ++i) {
        const t = tokens[i];

        if (stringDelim) {
            if (t.type === IntermediateTokenType.stringDelim
                && t.value === stringDelim
                && (i === 0
                    || tokens[i - 1].value[tokens[i - 1].value.length - 1] !== "\\")) {
                stringDelim = null;
            }
            if (t.type !== FinalTokenType.newLines) {
                t.type = FinalTokenType.strings;
            }
        }
        else if (commentDelim) {
            if ((commentDelim === IntermediateTokenType.startBlockComments
                && t.type === IntermediateTokenType.endBlockComments)
                || (commentDelim === IntermediateTokenType.startLineComments
                    && t.type === FinalTokenType.newLines)) {
                commentDelim = null;
            }
            if (t.type !== FinalTokenType.newLines) {
                t.type = FinalTokenType.comments;
            }
        }
        else if (t.type === IntermediateTokenType.stringDelim) {
            stringDelim = t.value;
            t.type = FinalTokenType.strings;
        }
        else if (t.type === IntermediateTokenType.startBlockComments
            || t.type === IntermediateTokenType.startLineComments) {
            commentDelim = t.type;
            t.type = FinalTokenType.comments;
        }
    }

    // recombine like-tokens
    for (let i = tokens.length - 1; i > 0; --i) {
        const p = tokens[i - 1],
            t = tokens[i];
        if (p.type === t.type
            && p.type !== FinalTokenType.newLines) {
            p.value += t.value;
            tokens.splice(i, 1);
        }
    }

    // remove empties
    for (let i = tokens.length - 1; i >= 0; --i) {
        if (tokens[i].length === 0) {
            tokens.splice(i, 1);
        }
    }
}

export class Grammar {

    private grammar: readonly Rule[];

    constructor(public readonly name: string,
        rules: Array<[TokenType, RegExp]>) {
        /*
        pliny.property({
          parent: "Primrose.Text.Grammar",
          name: "grammar",
          type: "Array",
          description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
        });
        */
        // clone the preprocessing grammar to start a new grammar
        this.grammar = rules.map((rule) =>
            new Rule(rule[0], rule[1]));

        Object.freeze(this);
    }

    /*
    pliny.method({
      parent: "Primrose.Text.Grammar",
      name: "tokenize",
      parameters: [{
        name: "text",
        type: "String",
        description: "The text to tokenize."
      }],
      returns: "An array of tokens, ammounting to drawing instructions to the renderer. However, they still need to be layed out to fit the bounds of the text area.",
      description: "Breaks plain text up into a list of tokens that can later be rendered with color.",
      examples: [{
        name: 'Tokenize some JavaScript',
        description: 'Primrose comes with a grammar for JavaScript built in.\n\
  \n\
  ## Code:\n\
  \n\
    grammar(\"JavaScript\");\n\
    var tokens = new Primrose.Text.Grammars.JavaScript\n\
      .tokenize("var x = 3;\\n\\\n\
    var y = 2;\\n\\\n\
    console.log(x + y);");\n\
    console.log(JSON.stringify(tokens));\n\
  \n\
  ## Result:\n\
  \n\
    grammar(\"JavaScript\");\n\
    [ \n\
      { "value": "var", "type": "keywords", "index": 0, "line": 0 },\n\
      { "value": " x = ", "type": "regular", "index": 3, "line": 0 },\n\
      { "value": "3", "type": "numbers", "index": 8, "line": 0 },\n\
      { "value": ";", "type": "regular", "index": 9, "line": 0 },\n\
      { "value": "\\n", "type": "newlines", "index": 10, "line": 0 },\n\
      { "value": " y = ", "type": "regular", "index": 11, "line": 1 },\n\
      { "value": "2", "type": "numbers", "index": 16, "line": 1 },\n\
      { "value": ";", "type": "regular", "index": 17, "line": 1 },\n\
      { "value": "\\n", "type": "newlines", "index": 18, "line": 1 },\n\
      { "value": "console", "type": "members", "index": 19, "line": 2 },\n\
      { "value": ".", "type": "regular", "index": 26, "line": 2 },\n\
      { "value": "log", "type": "functions", "index": 27, "line": 2 },\n\
      { "value": "(x + y);", "type": "regular", "index": 30, "line": 2 }\n\
    ]'
      }]
    });
    */
    tokenize(text: string) {
        // all text starts off as regular text, then gets cut up into tokens of
        // more specific type
        const tokens = [new Token(text, FinalTokenType.regular, 0)];
        for (let rule of this.grammar) {
            for (var j = 0; j < tokens.length; ++j) {
                rule.carveOutMatchedToken(tokens, j);
            }
        }

        crudeParsing(tokens);
        return tokens;
    }

    toHTML(parent: HTMLElement, txt: string, theme: Theme, fontSize: number) {
        if (theme === undefined) {
            theme = DefaultTheme;
        }

        var tokenRows = this.tokenize(txt),
            temp = Div();
        for (var y = 0; y < tokenRows.length; ++y) {
            // draw the tokens on this row
            var t = tokenRows[y];
            if (t.type === FinalTokenType.newLines) {
                temp.appendChild(BR());
            }
            else if (isFinalTokenType(t.type)) {
                const style = theme[t.type] || {};
                const elem = Span(styles(
                    fontWeight(style.fontWeight || theme.regular.fontWeight),
                    fontStyle(style.fontStyle || theme.regular.fontStyle || ""),
                    color(style.foreColor || theme.regular.foreColor),
                    backgroundColor(style.backColor || theme.regular.backColor),
                    getMonospaceFamily()),
                    t.value);
                temp.appendChild(elem);
            }
        }

        parent.innerHTML = temp.innerHTML;
        Object.assign(parent.style, {
            backgroundColor: theme.regular.backColor,
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize}px`,
        });
    }
};
