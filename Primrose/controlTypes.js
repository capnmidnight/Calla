export const singleLineOutput = [
    "CursorLeft",
    "CursorRight",
    "CursorSkipLeft",
    "CursorSkipRight",
    "CursorHome",
    "CursorEnd",
    "CursorFullHome",
    "CursorFullEnd",
    "SelectLeft",
    "SelectRight",
    "SelectSkipLeft",
    "SelectSkipRight",
    "SelectHome",
    "SelectEnd",
    "SelectFullHome",
    "SelectFullEnd",
    "SelectAll"
];
export const multiLineOutput = [
    "CursorLeft",
    "CursorRight",
    "CursorSkipLeft",
    "CursorSkipRight",
    "CursorHome",
    "CursorEnd",
    "CursorFullHome",
    "CursorFullEnd",
    "SelectLeft",
    "SelectRight",
    "SelectSkipLeft",
    "SelectSkipRight",
    "SelectHome",
    "SelectEnd",
    "SelectFullHome",
    "SelectFullEnd",
    "SelectAll",
    "CursorDown",
    "CursorUp",
    "CursorPageDown",
    "CursorPageUp",
    "SelectDown",
    "SelectUp",
    "SelectPageDown",
    "SelectPageUp",
    "ScrollDown",
    "ScrollUp"
];
const input = [
    "Backspace",
    "Delete",
    "DeleteWordLeft",
    "DeleteWordRight",
    "DeleteLine",
    "Undo",
    "Redo",
];
const appendInput = [
    "AppendNewline",
    "PrependNewline"
];
export const singleLineInput = singleLineOutput
    .concat(input);
export const multiLineInput = multiLineOutput
    .concat(input)
    .concat(appendInput);
//# sourceMappingURL=controlTypes.js.map