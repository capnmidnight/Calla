/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "PlainText",
  description: "A grammar that makes displaying plain text work with the text editor designed for syntax highlighting."
});
*/

import { Grammar } from "./Grammar";
import { FinalTokenType } from "./Token";

export const PlainText = new Grammar("PlainText", [
    [FinalTokenType.newLines, /(?:\r\n|\r|\n)/],
    [FinalTokenType.whitespace, /(?:\s+)/]
]);
