import { Grammar } from "./Grammars/Grammar.js";
import { Basic } from "./Grammars/Basic.js";
import { HTML } from "./Grammars/HTML.js";
import { JavaScript } from "./Grammars/JavaScript.js";
import { PlainText } from "./Grammars/PlainText.js";

export {
    Grammar,
    Basic,
    HTML,
    JavaScript,
    PlainText
};

export const grammars = Object.freeze(new Map([
    ["basic", Basic],
    ["bas", Basic],
    ["html", HTML],
    ["javascript", JavaScript],
    ["js", JavaScript],
    ["plaintext", PlainText],
    ["txt", PlainText]
]));