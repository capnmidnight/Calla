import { FinalTokenType } from "./Grammars/Token";
const defaultLight = {
    backColor: "white",
    foreColor: "black",
};
// A light background with dark foreground text.
export const Light = {
    name: "Light",
    cursorColor: "black",
    unfocused: "rgba(0, 0, 255, 0.25)",
    currentRowBackColor: "#f0f0f0",
    selectedBackColor: "#c0c0c0",
    [FinalTokenType.whitespace]: defaultLight,
    [FinalTokenType.newLines]: defaultLight,
    [FinalTokenType.lineNumbers]: defaultLight,
    [FinalTokenType.regular]: defaultLight,
    [FinalTokenType.operators]: defaultLight,
    [FinalTokenType.strings]: {
        foreColor: "#aa9900",
        fontStyle: "italic"
    },
    [FinalTokenType.regexes]: {
        foreColor: "#aa0099",
        fontStyle: "italic"
    },
    [FinalTokenType.numbers]: {
        foreColor: "green"
    },
    [FinalTokenType.comments]: {
        foreColor: "grey",
        fontStyle: "italic"
    },
    [FinalTokenType.keywords]: {
        foreColor: "blue"
    },
    [FinalTokenType.functions]: {
        foreColor: "brown",
        fontWeight: "bold"
    },
    [FinalTokenType.members]: {
        foreColor: "green"
    },
    [FinalTokenType.identifiers]: {
        foreColor: "green"
    },
    [FinalTokenType.error]: {
        foreColor: "red",
        fontStyle: "underline italic"
    }
};
// Color themes for text-oriented controls, for use when coupled with a parsing grammar.
const defaultDark = {
    backColor: "black",
    foreColor: "#c0c0c0"
};
// A dark background with a light foreground for text.
export const Dark = {
    name: "Dark",
    cursorColor: "white",
    unfocused: "rgba(0, 0, 255, 0.25)",
    currentRowBackColor: "#202020",
    selectedBackColor: "#404040",
    [FinalTokenType.whitespace]: defaultDark,
    [FinalTokenType.operators]: defaultDark,
    [FinalTokenType.newLines]: defaultDark,
    [FinalTokenType.lineNumbers]: {
        foreColor: "white"
    },
    [FinalTokenType.regular]: defaultDark,
    [FinalTokenType.strings]: {
        foreColor: "#aa9900",
        fontStyle: "italic"
    },
    [FinalTokenType.regexes]: {
        foreColor: "#aa0099",
        fontStyle: "italic"
    },
    [FinalTokenType.numbers]: {
        foreColor: "green"
    },
    [FinalTokenType.comments]: {
        foreColor: "yellow",
        fontStyle: "italic"
    },
    [FinalTokenType.keywords]: {
        foreColor: "cyan"
    },
    [FinalTokenType.functions]: {
        foreColor: "brown",
        fontWeight: "bold"
    },
    [FinalTokenType.members]: {
        foreColor: "green"
    },
    [FinalTokenType.identifiers]: {
        foreColor: "green"
    },
    [FinalTokenType.error]: {
        foreColor: "red",
        fontStyle: "underline italic"
    }
};
export const themes = new Map([
    ["light", Light],
    ["dark", Dark]
]);
//# sourceMappingURL=themes.js.map