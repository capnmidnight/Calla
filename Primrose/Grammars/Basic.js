import { Grammar } from "./Grammar";
import { FinalTokenType, IntermediateTokenType } from "./Token";
// A grammar and an interpreter for a BASIC-like language.
export const Basic = new Grammar("BASIC", 
// Grammar rules are applied in the order they are specified.
[
    [FinalTokenType.newLines, /(?:\r\n|\r|\n)/],
    // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
    [FinalTokenType.lineNumbers, /^\d+\s+/],
    [FinalTokenType.whitespace, /(?:\s+)/],
    // Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
    [IntermediateTokenType.startLineComments, /^REM\s/],
    // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
    [IntermediateTokenType.stringDelim, /("|')/],
    // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
    [FinalTokenType.numbers, /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    // Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
    [FinalTokenType.keywords,
        /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
    ],
    // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
    [FinalTokenType.keywords, /^DEF FN/],
    // These are all treated as mathematical operations.
    [FinalTokenType.operators,
        /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
    ],
    // Once everything else has been matched, the left over blocks of words are treated as variable and function names.
    [FinalTokenType.members, /\w+\$?/]
]);
//# sourceMappingURL=Basic.js.map