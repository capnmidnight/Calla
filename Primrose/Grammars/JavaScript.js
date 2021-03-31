/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "JavaScript",
  description: "A grammar for the JavaScript programming language."
});
*/
import { Grammar } from "./Grammar";
import { FinalTokenType, IntermediateTokenType } from "./Token";
export const JavaScript = new Grammar("JavaScript", [
    [FinalTokenType.newLines, /(?:\r\n|\r|\n)/],
    [FinalTokenType.whitespace, /(?:\s+)/],
    [IntermediateTokenType.startBlockComments, /\/\*/],
    [IntermediateTokenType.endBlockComments, /\*\//],
    [FinalTokenType.regexes, /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/],
    [IntermediateTokenType.stringDelim, /("|'|`)/],
    [IntermediateTokenType.startLineComments, /\/\/.*$/m],
    [FinalTokenType.numbers, /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    [FinalTokenType.keywords,
        /\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
    ],
    [FinalTokenType.functions, /(\w+)(?:\s*\()/],
    [FinalTokenType.members, /(\w+)\./],
    [FinalTokenType.members, /((\w+\.)+)(\w+)/]
]);
//# sourceMappingURL=JavaScript.js.map