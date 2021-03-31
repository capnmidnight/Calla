export enum singleLineOutput {
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
}

export enum multiLineOutput {
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
}

enum input {
    "Backspace",
    "Delete",
    "DeleteWordLeft",
    "DeleteWordRight",
    "DeleteLine",

    "Undo",
    "Redo",
}

enum appendInput {
    "AppendNewline",
    "PrependNewline"
}

export type singleLineInput = singleLineOutput
    | input;

export type multiLineInput = multiLineOutput
    | input
    | appendInput;