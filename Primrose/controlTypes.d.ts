export declare enum singleLineOutput {
    "CursorLeft" = 0,
    "CursorRight" = 1,
    "CursorSkipLeft" = 2,
    "CursorSkipRight" = 3,
    "CursorHome" = 4,
    "CursorEnd" = 5,
    "CursorFullHome" = 6,
    "CursorFullEnd" = 7,
    "SelectLeft" = 8,
    "SelectRight" = 9,
    "SelectSkipLeft" = 10,
    "SelectSkipRight" = 11,
    "SelectHome" = 12,
    "SelectEnd" = 13,
    "SelectFullHome" = 14,
    "SelectFullEnd" = 15,
    "SelectAll" = 16
}
export declare enum multiLineOutput {
    "CursorLeft" = 0,
    "CursorRight" = 1,
    "CursorSkipLeft" = 2,
    "CursorSkipRight" = 3,
    "CursorHome" = 4,
    "CursorEnd" = 5,
    "CursorFullHome" = 6,
    "CursorFullEnd" = 7,
    "SelectLeft" = 8,
    "SelectRight" = 9,
    "SelectSkipLeft" = 10,
    "SelectSkipRight" = 11,
    "SelectHome" = 12,
    "SelectEnd" = 13,
    "SelectFullHome" = 14,
    "SelectFullEnd" = 15,
    "SelectAll" = 16,
    "CursorDown" = 17,
    "CursorUp" = 18,
    "CursorPageDown" = 19,
    "CursorPageUp" = 20,
    "SelectDown" = 21,
    "SelectUp" = 22,
    "SelectPageDown" = 23,
    "SelectPageUp" = 24,
    "ScrollDown" = 25,
    "ScrollUp" = 26
}
declare enum input {
    "Backspace" = 0,
    "Delete" = 1,
    "DeleteWordLeft" = 2,
    "DeleteWordRight" = 3,
    "DeleteLine" = 4,
    "Undo" = 5,
    "Redo" = 6
}
declare enum appendInput {
    "AppendNewline" = 0,
    "PrependNewline" = 1
}
export declare type singleLineInput = singleLineOutput | input;
export declare type multiLineInput = multiLineOutput | input | appendInput;
export {};
